require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');
const connectDB = require('./config/db');

connectDB();

const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", price: 10.99, coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop", description: "A classic novel of the Jazz Age.", stock: 15 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", price: 12.50, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop", description: "A gripping, heart-wrenching, and wholly remarkable tale.", stock: 20 },
    { title: "1984", author: "George Orwell", genre: "Dystopian", price: 9.99, coverImage: "https://images.unsplash.com/photo-1474932430478-367d26bb3ce4?q=80&w=400&auto=format&fit=crop", description: "Among the seminal texts of the 20th century.", stock: 30 },
    { title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", price: 8.99, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop", description: "A romantic novel of manners.", stock: 25 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Fiction", price: 11.20, coverImage: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=400&auto=format&fit=crop", description: "A classic coming-of-age story.", stock: 18 },
    { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", price: 14.50, coverImage: "https://images.unsplash.com/photo-1621360841013-c76831f1628c?q=80&w=400&auto=format&fit=crop", description: "A great modern classic.", stock: 40 },
    { title: "Fahrenheit 451", author: "Ray Bradbury", genre: "Dystopian", price: 10.00, coverImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop", description: "A dystopian novel about a future American society.", stock: 22 },
    { title: "Jane Eyre", author: "Charlotte Brontë", genre: "Romance", price: 9.50, coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop", description: "A novel of intense power and intrigue.", stock: 12 },
    { title: "Animal Farm", author: "George Orwell", genre: "Political Satire", price: 7.99, coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=400&auto=format&fit=crop", description: "A fairy story with a biting political message.", stock: 35 },
    { title: "Brave New World", author: "Aldous Huxley", genre: "Sci-Fi", price: 11.99, coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop", description: "A dystopian social science fiction novel.", stock: 28 },
    { title: "Moby-Dick", author: "Herman Melville", genre: "Adventure", price: 13.50, coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efac4?q=80&w=400&auto=format&fit=crop", description: "An epic tale of the sea.", stock: 10 },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", price: 25.00, coverImage: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=400&auto=format&fit=crop", description: "The ultimate epic fantasy.", stock: 15 },
    { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", price: 10.99, coverImage: "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?q=80&w=400&auto=format&fit=crop", description: "The Boy Who Lived.", stock: 50 },
    { title: "The Chronicles of Narnia", author: "C.S. Lewis", genre: "Fantasy", price: 18.00, coverImage: "https://images.unsplash.com/photo-1474932430478-367d26bb3ce4?q=80&w=400&auto=format&fit=crop", description: "Journeys to the end of the world.", stock: 25 },
    { title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", price: 9.99, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop", description: "A story about listening to your heart.", stock: 40 },
    { title: "The Little Prince", author: "Antoine de Saint-Exupéry", genre: "Children's", price: 8.50, coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=400&auto=format&fit=crop", description: "A philosophical tale.", stock: 30 },
    { title: "The Kite Runner", author: "Khaled Hosseini", genre: "Historical Fiction", price: 14.00, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400&auto=format&fit=crop", description: "A story of fathers and sons.", stock: 22 },
    { title: "The Book Thief", author: "Markus Zusak", genre: "Historical Fiction", price: 12.99, coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400&auto=format&fit=crop", description: "A story about the power of words.", stock: 18 },
    { title: "Slaughterhouse-Five", author: "Kurt Vonnegut", genre: "Sci-Fi", price: 10.50, coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efac4?q=80&w=400&auto=format&fit=crop", description: "An anti-war book.", stock: 20 },
    { title: "Catch-22", author: "Joseph Heller", genre: "Satire", price: 11.50, coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop", description: "A satirical novel set during WWII.", stock: 15 }
];

const seedDB = async () => {
    try {
        await Book.deleteMany();
        console.log('Existing books cleared');
        await Book.insertMany(books);
        console.log('Database seeded with 20 books');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
