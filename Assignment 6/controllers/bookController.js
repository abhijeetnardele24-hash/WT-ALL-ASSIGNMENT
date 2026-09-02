const Book = require('../models/Book');

// Get all books with search, filter, and pagination
exports.getCatalogue = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        // Search by title or author
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { author: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        // Filter by genre
        if (req.query.genre && req.query.genre !== 'All') {
            query.genre = req.query.genre;
        }
        
        const books = await Book.find(query).skip(skip).limit(limit);
        const total = await Book.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        
        // Get unique genres for filter dropdown
        const genres = await Book.distinct('genre');
        
        res.render('catalogue', {
            books,
            currentPage: page,
            totalPages,
            totalBooks: total,
            searchQuery: req.query.search || '',
            selectedGenre: req.query.genre || 'All',
            genres
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Home page featured books
exports.getHomeBooks = async (req, res) => {
    try {
        const featuredBooks = await Book.find().limit(4);
        res.render('home', { featuredBooks });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
