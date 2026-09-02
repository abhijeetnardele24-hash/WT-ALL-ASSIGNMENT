const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.redirect('/auth/register?error=User+already+exists');
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user = new User({
            name,
            email,
            password: hashedPassword
        });
        
        await user.save();
        res.redirect('/auth/login?success=Registration+successful.+Please+log+in.');
    } catch (error) {
        console.error(error.message);
        res.redirect('/auth/register?error=Server+error');
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.redirect('/auth/login?error=Invalid+Credentials');
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.redirect('/auth/login?error=Invalid+Credentials');
        }
        
        // Create JWT
        const payload = {
            user: {
                id: user.id,
                name: user.name
            }
        };
        
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            // Set cookie
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/');
        });
    } catch (error) {
        console.error(error.message);
        res.redirect('/auth/login?error=Server+error');
    }
};

// Logout user
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};
