const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// Process register form
router.post('/register', authController.register);

// Show login form
router.get('/login', (req, res) => {
    res.render('login');
});

// Process login form
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
