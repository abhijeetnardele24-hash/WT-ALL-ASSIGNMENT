import express from 'express';
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  getAllSubjects,
  createSubject,
  deleteSubject,
  createNotice,
  deleteNotice,
  getSystemStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply protect & admin-only check to all routes in this router
router.use(protect);
router.use(authorize('ADMIN'));

// User CRUD
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Subjects CRUD
router.get('/subjects', getAllSubjects);
router.post('/subjects', createSubject);
router.delete('/subjects/:id', deleteSubject);

// Notices CRUD
router.post('/notices', createNotice);
router.delete('/notices/:id', deleteNotice);

// Stats
router.get('/stats', getSystemStats);

export default router;
