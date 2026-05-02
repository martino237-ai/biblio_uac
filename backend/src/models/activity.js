const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Activity = sequelize.define('Activity', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  utilisateur_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  action: { type: DataTypes.STRING(255), allowNull: false },
  details: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'activities',
  timestamps: true,
  underscored: true
});

module.exports = Activity;
