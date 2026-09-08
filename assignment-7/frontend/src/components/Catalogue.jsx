import { useState, useEffect } from 'react';
import axios from 'axios';

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

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Book Catalogue</h2>
      
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <div className="message">No books found in the database. Add some directly in MySQL!</div>
      ) : (
        <div className="grid">
          {books.map(book => (
            <div key={book.id} className="card">
              <div className="card-img">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                ) : (
                  <span>No Cover Available</span>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{book.title}</h3>
                <p className="card-author">By {book.author}</p>
                <div className="card-price">${book.price.toFixed(2)}</div>
                <button className="btn" style={{ width: '100%', marginTop: '1rem' }}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalogue;
