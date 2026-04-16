const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  titre: { type: DataTypes.STRING(300), allowNull: false },
  auteur: { type: DataTypes.STRING(255), allowNull: true },
  editeur: { type: DataTypes.STRING(255), allowNull: true },
  annee_publication: { type: DataTypes.INTEGER, allowNull: true },
  edition: { type: DataTypes.STRING(100), allowNull: true },
  langue: { type: DataTypes.STRING(50), allowNull: true },
  nombre_pages: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  resume: { type: DataTypes.TEXT, allowNull: true },
  theme: { type: DataTypes.STRING(255), allowNull: true },
  mots_cles: { type: DataTypes.TEXT, allowNull: true },
  genre: { type: DataTypes.STRING(100), allowNull: true },
  issn: { type: DataTypes.STRING(20), allowNull: true },
  volume_number: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  issue_number: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  issue_date: { type: DataTypes.DATEONLY, allowNull: true },
  frequency: { type: DataTypes.ENUM('hebdomadaire', 'mensuel', 'trimestriel', 'annuel', 'irrégulier'), allowNull: true },
  type_ouvrage: { type: DataTypes.ENUM('livre', 'revue', 'ouvrage de référence', 'document académique', 'memoire', 'périodique'), allowNull: true, defaultValue: 'livre' },
  etat: { type: DataTypes.ENUM('disponible', 'reparation'), allowNull: true, defaultValue: 'disponible' },
  date_acquisition: { type: DataTypes.DATEONLY, allowNull: true },
  total_exemplaires: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  exemplaires_disponibles: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 1 },
  description: { type: DataTypes.TEXT, allowNull: true },
  emplacement: { type: DataTypes.STRING(255), allowNull: true }
  
}, {
  tableName: 'books',
  timestamps: true,        // active createdAt / updatedAt
  underscored: false 
});
Book.associate = (models) => {
  Book.hasMany(models.Loan, { foreignKey: 'livre_id', as: 'loan' });
};
Book.associate = (models) => {
  Book.hasMany(models.Consultation, { foreignKey: 'livre_id', as: 'consultation' });
};
module.exports = Book;
