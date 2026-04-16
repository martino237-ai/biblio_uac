const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consultation = sequelize.define('Consultation', {
  id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  lecteur_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  livre_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  heure_debut: { type: DataTypes.DATE, allowNull: false },
  heure_fin: { type: DataTypes.DATE, allowNull: true },
  //note: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'consultations',
  timestamps: true,        // active createdAt / updatedAt
  underscored: false
});
 // 👇 Définir les associations
  Consultation.associate = (models) => {
    Consultation.belongsTo(models.Reader, { foreignKey: 'lecteur_id', as: 'reader' });
    Consultation.belongsTo(models.Book, { foreignKey: 'livre_id', as: 'book' });
  }

module.exports = Consultation;
