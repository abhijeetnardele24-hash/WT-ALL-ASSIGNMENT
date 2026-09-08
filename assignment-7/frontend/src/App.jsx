import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Catalogue from './components/Catalogue';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="nav">
          <h2><Link to="/">BookStore</Link></h2>
          <div className="nav-links">
            <Link to="/catalogue">Catalogue</Link>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn">Sign Up</Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
