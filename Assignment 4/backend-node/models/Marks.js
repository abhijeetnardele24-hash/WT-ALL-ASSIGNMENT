import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Marks = sequelize.define('Marks', {
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
  mse: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 25.00,
  },
  ese: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 60.00,
  },
  labWork: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 22.00,
  }
}, {
  tableName: 'marks',
  timestamps: true,
});

export default Marks;
