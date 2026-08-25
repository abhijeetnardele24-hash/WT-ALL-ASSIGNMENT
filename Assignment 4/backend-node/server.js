import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import sequelize from './config/db.js';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes.js';
import marksRoutes from './routes/marksRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import academicRoutes from './routes/academicRoutes.js';

// Basic Route
app.get('/', (req, res) => {
  res.send('VIT Enterprise College ERP API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/academic', academicRoutes);

// Sync Database and Start Server
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB();
  
  // Sync models
  try {
    await sequelize.sync();
    console.log('Database synced successfully');
  } catch (err) {
    console.error('Error syncing database:', err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
