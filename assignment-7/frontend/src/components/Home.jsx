import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  return (
    <motion.div 
      className="hero"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Discover Your Next Great Read
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Explore thousands of books from across the globe in our modern, elegantly designed online catalogue.
      </motion.p>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Link to="/catalogue" className="btn" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
          Browse Catalogue
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default Home;
