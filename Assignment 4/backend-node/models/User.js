import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  prnNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('STUDENT', 'FACULTY', 'ADMIN'),
    defaultValue: 'STUDENT',
  },
  department: {
    type: DataTypes.STRING,
    defaultValue: 'Computer Engineering',
  },
  currentSemester: {
    type: DataTypes.INTEGER,
    defaultValue: 6,
  },
  batch: {
    type: DataTypes.STRING,
    defaultValue: '2022-2026',
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: '+91 98765 43210',
  },
  cgpa: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 8.50,
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to check password
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default User;
