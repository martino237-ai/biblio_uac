## Backend - Lancer en local

1. Copier .env.example en .env et remplir les variables (DB_NAME, DB_USER, DB_PASS, JWT_SECRET).
2. Installer dépendances: `npm install`
3. Lancer seed (optionnel): `npm run seed`
4. Lancer le serveur: `npm run dev`

Notes pour MySQL / XAMPP:

- Démarrez XAMPP et activez `MySQL` via le XAMPP Control Panel.
- Créez la base de données `bibliotheque_uac` (via phpMyAdmin ou en ligne de commande).
- Importez le fichier SQL d'initialisation si nécessaire: `backend/bibliotheque_uac_init.sql`.

Exemple (ligne de commande) pour importer le SQL depuis le dossier `backend`:

```
mysql -u root -p bibliotheque_uac < bibliotheque_uac_init.sql
```

Si vous utilisez phpMyAdmin: ouvrez `http://localhost/phpmyadmin`, sélectionnez la base `bibliotheque_uac` puis utilisez l'onglet "Importer" pour charger `bibliotheque_uac_init.sql`.

Assurez-vous de copier `.env.example` en `.env` et de définir `DB_DIALECT=mysql`.
