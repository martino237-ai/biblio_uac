const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3333;

async function ensureLoanTypeColumn() {
  try {
    // Vérifier si la colonne existe en utilisant PRAGMA pour SQLite
    const [rows] = await sequelize.query("PRAGMA table_info(loans)");
    const columnExists = rows.some(col => col.name === 'type_emprunt');

    if (!columnExists) {
      console.log('✅ Column type_emprunt missing, adding it now...');
      await sequelize.query(
        "ALTER TABLE loans ADD COLUMN type_emprunt TEXT DEFAULT 'normal' CHECK (type_emprunt IN ('normal','prolonge','limite'))"
      );
      console.log('✅ Column type_emprunt added');
    }
  } catch (error) {
    console.log('ℹ️ Column check failed, continuing...', error.message);
  }
}

async function ensureActivityTimestamps() {
  try {
    // Utiliser PRAGMA pour SQLite au lieu de information_schema
    const [rows] = await sequelize.query("PRAGMA table_info(activities)");
    const existingColumns = rows.map(r => r.name);

    if (!existingColumns.includes('created_at')) {
      console.log('✅ Colonne created_at manquante sur activities, ajout...');
      await sequelize.query(
        "ALTER TABLE activities ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
      );
      console.log('✅ Colonne created_at ajoutée');
    }

    if (!existingColumns.includes('updated_at')) {
      console.log('✅ Colonne updated_at manquante sur activities, ajout...');
      await sequelize.query(
        "ALTER TABLE activities ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
      );
      console.log('✅ Colonne updated_at ajoutée');
    }
  } catch (error) {
    console.log('ℹ️ Vérification des colonnes activities échouée, continuation...', error.message);
  }
}

async function ensureUserEmailColumn() {
  try {
    const [rows] = await sequelize.query("PRAGMA table_info(users)");
    const columnExists = rows.some(col => col.name === 'email');

    if (!columnExists) {
      console.log('✅ Colonne email manquante sur users, ajout...');
      await sequelize.query("ALTER TABLE users ADD COLUMN email VARCHAR(150)");
      console.log('✅ Colonne email ajoutée');
    }
  } catch (error) {
    console.log('ℹ️ Vérification de la colonne email sur users échouée, continuation...', error.message);
  }
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connecté');

    await ensureLoanTypeColumn();
    await ensureActivityTimestamps();
    await ensureUserEmailColumn();
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
