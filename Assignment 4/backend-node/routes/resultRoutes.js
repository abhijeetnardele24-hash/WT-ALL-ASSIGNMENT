import express from 'express';
import { getMyResult } from '../controllers/resultController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, authorize('STUDENT'), getMyResult);

export default router;
