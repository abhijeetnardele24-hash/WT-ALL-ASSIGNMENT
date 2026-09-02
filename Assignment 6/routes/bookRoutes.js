const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Catalogue route
router.get('/', bookController.getCatalogue);

module.exports = router;
