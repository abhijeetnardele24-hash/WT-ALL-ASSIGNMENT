import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 6,
  },
  totalConducted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 45,
  },
  totalAttended: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 38,
  },
}, {
  tableName: 'attendance',
  timestamps: true,
});

export default Attendance;
