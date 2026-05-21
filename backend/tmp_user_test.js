const { User, sequelize } = require('./src/models');
(async () => {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({ raw: true });
    console.log(users);
  } catch (e) {
    console.error('ERROR', e);
  } finally {
    await sequelize.close();
  }
})();
