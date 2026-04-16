const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reader = sequelize.define('Reader', {
  id: { 
    type: DataTypes.INTEGER.UNSIGNED, 
    autoIncrement: true, 
    primaryKey: true 
  },
  matricule: { type: DataTypes.STRING(100), allowNull: true, unique: true },
  nom: { type: DataTypes.STRING(150), allowNull: false },
  prenom: { type: DataTypes.STRING(150), allowNull: false },
  type: { 
    type: DataTypes.ENUM('etudiant','enseignant','personnel','autre'), 
    allowNull: false, 
    defaultValue: 'etudiant' 
  },
  faculte: { type: DataTypes.STRING(150), allowNull: true },
  filiere: { type: DataTypes.STRING(150), allowNull: true },
  niveau: { type: DataTypes.STRING(50), allowNull: true }, 
  email: { type: DataTypes.STRING(200), allowNull: true },
  telephone: { type: DataTypes.STRING(50), allowNull: true },
  date_inscription: { type: DataTypes.DATEONLY, allowNull: true }
}, {
  tableName: 'readers',
  timestamps: true,       // ✅ Sequelize gère automatiquement createdAt / updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Reader.associate = (models) => {
  Reader.hasMany(models.Loan, { foreignKey: 'lecteur_id', as: 'loan' });
  Reader.hasMany(models.Consultation, { foreignKey: 'lecteur_id', as: 'consultation' });
};

module.exports = Reader;
