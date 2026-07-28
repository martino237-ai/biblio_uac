const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: true, unique: true },
  // add lecteur role so that readers can sign up
  role: { type: DataTypes.ENUM('bibliothecaire','directeur','lecteur'), allowNull: false, defaultValue: 'bibliothecaire' },
  nom: { type: DataTypes.STRING(150), allowNull: true },
  // lien explicite vers la fiche lecteur associée (garantit 1 lecteur <-> 1 utilisateur)
  reader_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, unique: true }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
