const { sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.drop();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Database reset done');
    process.exit(0);
  } catch (err) {
    console.error('Reset error', err);
    process.exit(1);
  }
})();
