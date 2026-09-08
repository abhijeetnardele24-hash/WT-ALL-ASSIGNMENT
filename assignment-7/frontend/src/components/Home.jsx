import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="hero">
      <h1>Discover Your Next Great Read</h1>
      <p>Explore thousands of books from across the globe in our modern online catalogue.</p>
      <Link to="/catalogue" className="btn" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
        Browse Catalogue
      </Link>
    </div>
  );
}

export default Home;
