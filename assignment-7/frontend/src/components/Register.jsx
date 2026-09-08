import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        name,
        email,
        password
      });
      setMessage('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data || 'Registration failed.');
    }
  };

  return (
    <motion.div 
      className="form-container glass-panel"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>Create Account</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="john@example.com"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Create a strong password"
          />
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          className="btn" 
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Register
        </motion.button>
      </form>
      {message && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="message">{message}</motion.div>}
    </motion.div>
  );
}

export default Register;
