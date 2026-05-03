const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3333;

async function ensureLoanTypeColumn() {
  const [rows] = await sequelize.query(
    `SELECT COUNT(*) AS count FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'loans'
       AND column_name = 'type_emprunt'`
  );
  const exists = rows[0] && (rows[0].count || rows[0].COUNT || rows[0]['count(*)']);
  if (!exists) {
    console.log('✅ Column type_emprunt missing, adding it now...');
    await sequelize.query(
      "ALTER TABLE loans ADD COLUMN type_emprunt ENUM('normal','prolonge','limite') NOT NULL DEFAULT 'normal' AFTER date_retour_prevue"
    );
    console.log('✅ Column type_emprunt added');
  }
}

async function ensureActivityTimestamps() {
  const [rows] = await sequelize.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = 'activities'
       AND column_name IN ('created_at', 'updated_at')`
  );
  const existingColumns = rows.map(r => r.column_name);

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
      "ALTER TABLE activities ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    );
    console.log('✅ Colonne updated_at ajoutée');
  }
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connecté');

    await ensureLoanTypeColumn();
    await ensureActivityTimestamps();
    await sequelize.sync({ alter: true }); // keep schema in sync with models
    console.log('✅ Schéma synchronisé');

    app.listen(PORT, () => {
      console.log(`✅ Backend lancé sur le port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ erreur de lancement du serveur:', err);
    process.exit(1);
  }
})();
