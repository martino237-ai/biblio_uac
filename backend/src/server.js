const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3333;

async function ensureLoanTypeColumn() {
  try {
    const dialect = sequelize.getDialect();

    if (dialect === 'sqlite') {
      const [rows] = await sequelize.query("PRAGMA table_info(loans)");
      const columnExists = rows.some(col => col.name === 'type_emprunt');

      if (!columnExists) {
        console.log('✅ Column type_emprunt missing (sqlite), adding it now...');
        await sequelize.query(
          "ALTER TABLE loans ADD COLUMN type_emprunt TEXT DEFAULT 'normal'"
        );
        console.log('✅ Column type_emprunt added (sqlite)');
      }
    } else {
      // MySQL / MariaDB
      const dbName = sequelize.config.database || process.env.DB_NAME;
      const [[row]] = await sequelize.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'loans' AND COLUMN_NAME = 'type_emprunt'",
        { replacements: [dbName] }
      );

      if (!row) {
        console.log('✅ Column type_emprunt missing (mysql), adding it now...');
        await sequelize.query(
          "ALTER TABLE loans ADD COLUMN type_emprunt ENUM('normal','prolonge','limite') NOT NULL DEFAULT 'normal'"
        );
        console.log('✅ Column type_emprunt added (mysql)');
      }
    }
  } catch (error) {
    console.log('ℹ️ Column check failed, continuing...', error.message);
  }
}

async function ensureActivityTimestamps() {
  try {
    const dialect = sequelize.getDialect();

    if (dialect === 'sqlite') {
      const [rows] = await sequelize.query("PRAGMA table_info(activities)");
      const existingColumns = rows.map(r => r.name);

      if (!existingColumns.includes('created_at')) {
        console.log('✅ Colonne created_at manquante sur activities (sqlite), ajout...');
        await sequelize.query(
          "ALTER TABLE activities ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
        );
        console.log('✅ Colonne created_at ajoutée (sqlite)');
      }

      if (!existingColumns.includes('updated_at')) {
        console.log('✅ Colonne updated_at manquante sur activities (sqlite), ajout...');
        await sequelize.query(
          "ALTER TABLE activities ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
        );
        console.log('✅ Colonne updated_at ajoutée (sqlite)');
      }
    } else {
      const dbName = sequelize.config.database || process.env.DB_NAME;
      const [[created]] = await sequelize.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'activities' AND COLUMN_NAME = 'created_at'",
        { replacements: [dbName] }
      );
      const [[updated]] = await sequelize.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'activities' AND COLUMN_NAME = 'updated_at'",
        { replacements: [dbName] }
      );

      if (!created) {
        console.log('✅ Colonne created_at manquante sur activities (mysql), ajout...');
        await sequelize.query(
          "ALTER TABLE activities ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
        );
        console.log('✅ Colonne created_at ajoutée (mysql)');
      }

      if (!updated) {
        console.log('✅ Colonne updated_at manquante sur activities (mysql), ajout...');
        await sequelize.query(
          "ALTER TABLE activities ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        );
        console.log('✅ Colonne updated_at ajoutée (mysql)');
      }
    }
  } catch (error) {
    console.log('ℹ️ Vérification des colonnes activities échouée, continuation...', error.message);
  }
}

async function ensureUserEmailColumn() {
  try {
    const dialect = sequelize.getDialect();

    if (dialect === 'sqlite') {
      const [rows] = await sequelize.query("PRAGMA table_info(users)");
      const columnExists = rows.some(col => col.name === 'email');

      if (!columnExists) {
        console.log('✅ Colonne email manquante sur users (sqlite), ajout...');
        await sequelize.query("ALTER TABLE users ADD COLUMN email VARCHAR(150)");
        console.log('✅ Colonne email ajoutée (sqlite)');
      }
    } else {
      const dbName = sequelize.config.database || process.env.DB_NAME;
      const [[row]] = await sequelize.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email'",
        { replacements: [dbName] }
      );

      if (!row) {
        console.log('✅ Colonne email manquante sur users (mysql), ajout...');
        await sequelize.query("ALTER TABLE users ADD COLUMN email VARCHAR(150)");
        console.log('✅ Colonne email ajoutée (mysql)');
      }
    }
  } catch (error) {
    console.log('ℹ️ Vérification de la colonne email sur users échouée, continuation...', error.message);
  }
}

async function ensureUserReaderIdColumn() {
  try {
    const dialect = sequelize.getDialect();

    if (dialect === 'sqlite') {
      const [rows] = await sequelize.query("PRAGMA table_info(users)");
      const columnExists = rows.some(col => col.name === 'reader_id');

      if (!columnExists) {
        console.log('✅ Colonne reader_id manquante sur users (sqlite), ajout...');
        await sequelize.query("ALTER TABLE users ADD COLUMN reader_id INTEGER");
        console.log('✅ Colonne reader_id ajoutée (sqlite)');
      }
      // index unique : autorise plusieurs NULL, mais un seul utilisateur par lecteur
      await sequelize.query("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_reader_id ON users(reader_id)");
    } else {
      const dbName = sequelize.config.database || process.env.DB_NAME;
      const [[row]] = await sequelize.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'reader_id'",
        { replacements: [dbName] }
      );

      if (!row) {
        console.log('✅ Colonne reader_id manquante sur users (mysql), ajout...');
        await sequelize.query("ALTER TABLE users ADD COLUMN reader_id INT UNSIGNED NULL, ADD UNIQUE KEY uq_users_reader_id (reader_id)");
        console.log('✅ Colonne reader_id ajoutée (mysql)');
      }
    }
  } catch (error) {
    console.log('ℹ️ Vérification de la colonne reader_id sur users échouée, continuation...', error.message);
  }
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connecté');

    await ensureLoanTypeColumn();
    await ensureActivityTimestamps();
    await ensureUserEmailColumn();
    await ensureUserReaderIdColumn();
    await sequelize.sync(); // avoid ALTER with SQLite to prevent incompatible migration errors
    console.log('✅ Schéma synchronisé');

    app.listen(PORT, () => {
      console.log(`✅ Backend lancé sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ erreur de lancement du serveur:', err);
    process.exit(1);
  }
})();
