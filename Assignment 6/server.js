require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to pass user info to all views
const jwt = require('jsonwebtoken');
app.use((req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded.user;
        } catch (err) {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
});

// Error/Flash message middleware via query params
app.use((req, res, next) => {
    res.locals.error = req.query.error || null;
    res.locals.success = req.query.success || null;
    next();
});

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/catalogue', require('./routes/bookRoutes'));

const bookController = require('./controllers/bookController');

// Default Route
app.get('/', bookController.getHomeBooks);

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('home', { error: 'Page not found', featuredBooks: [] });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('home', { error: 'Something went wrong on the server!', featuredBooks: [] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // QA passed successfully
});
