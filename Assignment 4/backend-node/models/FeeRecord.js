import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FeeRecord = sequelize.define('FeeRecord', {
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
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 85000.00,
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 85000.00,
  },
  status: {
    type: DataTypes.ENUM('PAID', 'PARTIAL', 'PENDING'),
    defaultValue: 'PAID',
  },
  transactionId: {
    type: DataTypes.STRING,
    defaultValue: 'TXN-VIT-2026-9821',
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  receiptNumber: {
    type: DataTypes.STRING,
    defaultValue: 'REC-2026-00452',
  },
}, {
  tableName: 'fee_records',
  timestamps: true,
});

export default FeeRecord;
