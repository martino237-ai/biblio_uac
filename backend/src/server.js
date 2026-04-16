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

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connecté');

    await ensureLoanTypeColumn();
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
