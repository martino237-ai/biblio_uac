const { sequelize } = require('./src/models');
(async () => {
  try {
    await sequelize.query("ALTER TABLE users ADD COLUMN email VARCHAR(150)");
    console.log('✅ Colonne email ajoutée à la table users');
  } catch (e) {
    console.log('Info:', e.message);
  } finally {
    await sequelize.close();
  }
})();
