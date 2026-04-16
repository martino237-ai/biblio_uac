const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  // add lecteur role so that readers can sign up
  role: { type: DataTypes.ENUM('bibliothecaire','directeur','lecteur'), allowNull: false, defaultValue: 'bibliothecaire' },
  nom: { type: DataTypes.STRING(150), allowNull: true }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
