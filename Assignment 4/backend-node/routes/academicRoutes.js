import express from 'express';
import { 
  getAcademicOverview, 
  getSemesterResults, 
  getStudentAttendance, 
  getHallTicket, 
  getFeeDetails, 
  getNotices, 
  getCurriculum 
} from '../controllers/academicController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Student Academic Routes
router.get('/overview', protect, getAcademicOverview);
router.get('/results', protect, getSemesterResults);
router.get('/attendance', protect, getStudentAttendance);
router.get('/hall-ticket', protect, getHallTicket);
router.get('/fees', protect, getFeeDetails);
router.get('/notices', protect, getNotices);
router.get('/curriculum', protect, getCurriculum);

export default router;
