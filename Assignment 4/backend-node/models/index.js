import User from './User.js';
import Subject from './Subject.js';
import Marks from './Marks.js';
import Attendance from './Attendance.js';
import FeeRecord from './FeeRecord.js';
import Notice from './Notice.js';

// User <-> Marks
User.hasMany(Marks, { foreignKey: 'studentId', as: 'marks' });
Marks.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Subject <-> Marks
Subject.hasMany(Marks, { foreignKey: 'subjectId', as: 'marks' });
Marks.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

// User <-> Attendance
User.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Attendance.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Subject <-> Attendance
Subject.hasMany(Attendance, { foreignKey: 'subjectId', as: 'attendances' });
Attendance.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

// User <-> FeeRecord
User.hasMany(FeeRecord, { foreignKey: 'studentId', as: 'fees' });
FeeRecord.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

export { User, Subject, Marks, Attendance, FeeRecord, Notice };
