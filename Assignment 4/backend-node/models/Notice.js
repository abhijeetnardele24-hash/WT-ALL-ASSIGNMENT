import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('ACADEMIC', 'EXAM', 'CIRCULAR', 'PLACEMENT', 'EVENT'),
    defaultValue: 'ACADEMIC',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    defaultValue: 'Dean of Academics, VIT',
  },
  priority: {
    type: DataTypes.ENUM('URGENT', 'HIGH', 'NORMAL'),
    defaultValue: 'NORMAL',
  },
  targetSemester: {
    type: DataTypes.INTEGER,
    allowNull: true, // null means all semesters
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'notices',
  timestamps: true,
});

export default Notice;
