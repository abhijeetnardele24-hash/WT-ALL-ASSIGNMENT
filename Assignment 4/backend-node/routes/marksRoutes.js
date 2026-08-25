import express from 'express';
import { 
  getStudentMarks, 
  updateMarks, 
  searchStudents, 
  saveBatchAttendance, 
  getFacultyAnalytics 
} from '../controllers/marksController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/students/search', protect, authorize('FACULTY', 'ADMIN'), searchStudents);
router.get('/student/:studentId', protect, authorize('FACULTY', 'ADMIN'), getStudentMarks);
router.put('/update', protect, authorize('FACULTY', 'ADMIN'), updateMarks);
router.post('/attendance/batch', protect, authorize('FACULTY', 'ADMIN'), saveBatchAttendance);
router.get('/analytics', protect, authorize('FACULTY', 'ADMIN'), getFacultyAnalytics);

export default router;
