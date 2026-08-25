import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: 'Computer Engineering',
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'Core', // 'Core', 'Professional Elective', 'Open Elective', 'Lab'
  },
}, {
  tableName: 'subjects',
  timestamps: false,
});

export default Subject;
