const sequelize = require('../config/db');
const Book = require('./book');
const Reader = require('./reader');
const Loan = require('./loan');
const Consultation = require('./consultation');
const Activity = require('./activity');
const User = require('./user');

// Associations
Reader.hasMany(Loan, { foreignKey: { name: 'lecteur_id', allowNull: true }, onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Loan.belongsTo(Reader, { foreignKey: 'lecteur_id', as: 'Reader' });

Book.hasMany(Loan, { foreignKey: { name: 'livre_id', allowNull: true }, onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Loan.belongsTo(Book, { foreignKey: 'livre_id', as: 'Book' });

Reader.hasMany(Consultation, { foreignKey: { name: 'lecteur_id', allowNull: true }, onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Consultation.belongsTo(Reader, { foreignKey: 'lecteur_id', as: 'Reader' });

Book.hasMany(Consultation, { foreignKey: { name: 'livre_id', allowNull: true }, onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Consultation.belongsTo(Book, { foreignKey: 'livre_id', as: 'Book' });

Reader.hasOne(User, { foreignKey: 'reader_id', as: 'User' });
User.belongsTo(Reader, { foreignKey: 'reader_id', as: 'Reader' });

module.exports = { sequelize, Book, Reader, Loan, Consultation, Activity, User };
