const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Loan = sequelize.define('Loan', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  lecteur_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  livre_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  date_emprunt: { type: DataTypes.DATEONLY, allowNull: false },
  date_retour_prevue: { type: DataTypes.DATEONLY, allowNull: false },
  type_emprunt: { type: DataTypes.ENUM('normal','prolonge','limite'), allowNull: false, defaultValue: 'normal' },
  date_retour_effective: { type: DataTypes.DATEONLY, allowNull: true },
  prolongations: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  statut: { type: DataTypes.ENUM('emprunte','retourne','en_retard'), allowNull: false, defaultValue: 'emprunte' },
  // notes: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'loans',
  timestamps: true,        // active createdAt / updatedAt
  underscored: false
});
  // 👇 Définir les associations
Loan.associate = (models) => {
  Loan.belongsTo(models.Reader, { foreignKey: 'lecteur_id', as: 'Reader' });
  Loan.belongsTo(models.Book, { foreignKey: 'livre_id', as: 'Book' });
}

module.exports = Loan;
