import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { Op } from 'sequelize';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  });
};

export const loginUser = async (req, res) => {
  const { prnNumber, identifier, password } = req.body;
  const rawInput = (identifier || prnNumber || '').trim();

  if (!rawInput) {
    return res.status(400).json({ message: 'PRN Number or Institutional Email is required.' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  // Institutional Email Domain Enforcement
  if (rawInput.includes('@')) {
    const emailLower = rawInput.toLowerCase();
    if (!emailLower.endsWith('@vit.edu')) {
      return res.status(403).json({ 
        message: 'Access Denied: Only official university email addresses ending with @vit.edu are authorized to log in.' 
      });
    }
  }

  try {
    const cleanInput = rawInput.toLowerCase();
    
    // Find user by either PRN or Institutional Email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { prnNumber: rawInput },
          { email: cleanInput }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not registered in institutional database.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please check your credentials.' });
    }

    // Return authenticated user payload
    res.json({
      id: user.id,
      prnNumber: user.prnNumber,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      currentSemester: user.currentSemester,
      cgpa: user.cgpa,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ message: 'Google token is missing.' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    if (!email.endsWith('@vit.edu')) {
      return res.status(403).json({ 
        message: 'Access Denied: Only official university email addresses ending with @vit.edu are authorized.' 
      });
    }

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Email verified, but user is not registered in the institutional ERP database.' });
    }

    res.json({
      id: user.id,
      prnNumber: user.prnNumber,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      currentSemester: user.currentSemester,
      cgpa: user.cgpa,
      token: generateToken(user.id, user.role),
    });
    
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Invalid or expired Google token.' });
  }
};
