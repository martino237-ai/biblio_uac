const { Reader, User, sequelize } = require('./src/models');
(async () => {
  try {
    await sequelize.authenticate();
    // make sure enum supports lecteur
    await sequelize.query("ALTER TABLE users MODIFY role ENUM('bibliothecaire','directeur','lecteur') DEFAULT 'bibliothecaire'");
    console.log('🔧 users.role enum altered (if needed)');

    let users = await User.findAll();
    console.log('USERS BEFORE FIX:', users.map(u => u.toJSON()));

    // fix any blank roles (shouldn't happen if enum change worked)
    await sequelize.query("UPDATE users SET role='lecteur' WHERE role = '' OR role IS NULL");
    users = await User.findAll();
    console.log('USERS AFTER FIX:', users.map(u => u.toJSON()));

    const readers = await Reader.findAll();
    console.log('READERS:', readers.map(r => r.toJSON()));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
