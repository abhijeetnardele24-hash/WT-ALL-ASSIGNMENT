import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function Catalogue() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 600 }}>Book Catalogue</h2>
      
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <div className="message">No books found in the database.</div>
      ) : (
        <motion.div 
          className="grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {books.map(book => (
            <motion.div key={book.id} className="card glass-panel" variants={itemVariants}>
              <div className="card-img">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <span>No Cover</span>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{book.title}</h3>
                <p className="card-author">By {book.author}</p>
                <div className="card-price">${book.price.toFixed(2)}</div>
                <button className="btn" style={{ width: '100%', marginTop: '1.5rem' }}>Add to Cart</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Catalogue;
