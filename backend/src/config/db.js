
require('dotenv').config();
const { Sequelize } = require('sequelize');

const DB_DIALECT = process.env.DB_DIALECT || 'mysql';
const sequelizeOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  dialect: DB_DIALECT,
  logging: false,
  define: {
    underscored: true, // created_at instead of createdAt
    timestamps: true
  },
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 }
};

// Only set storage when using sqlite
if (DB_DIALECT === 'sqlite') {
  sequelizeOptions.storage = process.env.DB_STORAGE || './database.sqlite';
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'bibliotheque_uac',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  sequelizeOptions
);

module.exports = sequelize;
