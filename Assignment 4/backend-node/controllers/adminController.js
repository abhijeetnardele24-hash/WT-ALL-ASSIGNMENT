import { User, Subject, Marks, Attendance, FeeRecord, Notice } from '../models/index.js';

// 1. Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['role', 'ASC'], ['prnNumber', 'ASC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// 2. Create a new user (Student / Faculty / Admin)
export const createUser = async (req, res) => {
  try {
    const { prnNumber, name, email, password, role, department, currentSemester, batch, phone } = req.body;
    
    const existingUser = await User.findOne({ where: { prnNumber } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this PRN already exists' });
    }

    const newUser = await User.create({
      prnNumber,
      name,
      email,
      password: password || 'password123',
      role: role || 'STUDENT',
      department: department || 'Computer Engineering',
      currentSemester: currentSemester || 6,
      batch: batch || '2022-2026',
      phone: phone || '+91 98765 43210'
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// 3. Update an existing user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { prnNumber, name, email, role, password, department, currentSemester, batch, phone } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.prnNumber = prnNumber || user.prnNumber;
    user.name = name || user.name;
    user.email = email !== undefined ? email : user.email;
    user.role = role || user.role;
    user.department = department || user.department;
    user.currentSemester = currentSemester || user.currentSemester;
    user.batch = batch || user.batch;
    user.phone = phone || user.phone;
    
    if (password && password.trim() !== '') {
      user.password = password;
    }

    await user.save();
    
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// 4. Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.id === req.user.id) return res.status(400).json({ message: 'Cannot delete your own admin account' });

    // Clean up dependent marks, attendance, fee records
    await Marks.destroy({ where: { studentId: id } });
    await Attendance.destroy({ where: { studentId: id } });
    await FeeRecord.destroy({ where: { studentId: id } });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// 5. Subject Management (CRUD)
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({ order: [['semester', 'ASC'], ['code', 'ASC']] });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { code, name, credits, semester, department, type } = req.body;
    const subject = await Subject.create({
      code,
      name,
      credits: parseInt(credits) || 3,
      semester: parseInt(semester) || 1,
      department: department || 'Computer Engineering',
      type: type || 'Core'
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await Marks.destroy({ where: { subjectId: id } });
    await Attendance.destroy({ where: { subjectId: id } });
    await Subject.destroy({ where: { id } });
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Notices Management
export const createNotice = async (req, res) => {
  try {
    const { title, category, content, priority, author } = req.body;
    const notice = await Notice.create({
      title,
      category: category || 'ACADEMIC',
      content,
      priority: priority || 'NORMAL',
      author: author || req.user.name || 'Dean of Academics'
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.destroy({ where: { id } });
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. System Analytics Overview
export const getSystemStats = async (req, res) => {
  try {
    const totalStudents = await User.count({ where: { role: 'STUDENT' } });
    const totalFaculty = await User.count({ where: { role: 'FACULTY' } });
    const totalSubjects = await Subject.count();
    const totalNotices = await Notice.count();

    const students = await User.findAll({ where: { role: 'STUDENT' }, attributes: ['cgpa'] });
    const avgCgpa = (students.reduce((sum, s) => sum + parseFloat(s.cgpa || 8.0), 0) / (students.length || 1)).toFixed(2);

    res.json({
      totalStudents,
      totalFaculty,
      totalSubjects,
      totalNotices,
      averageCGPA: parseFloat(avgCgpa),
      activeSemester: 6,
      academicYear: '2025-2026'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
