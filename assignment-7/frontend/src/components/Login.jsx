import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email,
        password
      });
      setMessage('Login successful!');
      setTimeout(() => navigate('/catalogue'), 1500);
    } catch (error) {
      setMessage(error.response?.data || 'Login failed. Please check credentials.');
    }
  };

  return (
    <motion.div 
      className="form-container glass-panel"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Enter your password"
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          className="btn" 
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Login
        </motion.button>
      </form>
      {message && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="message">{message}</motion.div>}
    </motion.div>
  );
}

export default Login;
