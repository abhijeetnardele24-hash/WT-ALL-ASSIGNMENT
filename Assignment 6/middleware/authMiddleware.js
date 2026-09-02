const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from cookie
    const token = req.cookies.token;
    
    // Check if no token
    if (!token) {
        // We'll redirect to login with a message later
        return res.redirect('/auth/login');
    }
    
    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/auth/login');
    }
};
