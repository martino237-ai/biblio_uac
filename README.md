# 📚 Bibliothèque UAC - Application Desktop

Une application de gestion complète pour les bibliothèques, construite avec **Electron**, **Node.js**, **MySQL** et **React**. Permet la gestion des livres, lecteurs, emprunts, consultations et génération de rapports statistiques.

## 🎯 Vue d'ensemble

**Bibliothèque UAC** est une solution desktop complète pour gérer tous les aspects d'une bibliothèque moderne:
- **Gestion des livres** : Catalogage, inventaire, recherche avancée
- **Gestion des lecteurs** : Inscription, profils, historique d'activité
- **Gestion des emprunts** : Prêts, retours, pénalités, alertes de retard
- **Consultations sur place** : Enregistrement des consultations de livres
- **Statistiques et rapports** : Tableaux de bord, exports PDF, visualisations dynamiques
- **Système d'authentification** : Rôles multiples (Directeur, Bibliothécaire, Lecteur)
- **Support multilingue** : Interface en français et anglais

## 🏗️ Architecture

L'application est composée de trois parties principales:

### 1. **Backend (Express + Sequelize)**
- API REST sécurisée avec authentification JWT
- Gestion de la base de données MySQL avec Sequelize ORM
- Middleware d'authentification et de contrôle d'accès basé sur les rôles (RBAC)
- Logging des activités
- **Port**: `3333`

### 2. **Frontend (React + Vite)**
- Interface utilisateur moderne et responsive avec React 18
- Styling avec Tailwind CSS
- Routage avec React Router v6
- Intégration Axios pour les appels API
- Support multilingue avec i18next
- Tableaux de bord avec Recharts et Chart.js
- Exports PDF et Excel

### 3. **Application Electron**
- Wrapper desktop basé sur Electron
- Empaquetage et distribution simple
- Intégration native du système d'exploitation

## ✨ Fonctionnalités principales

### Authentification & Gestion des utilisateurs
- ✅ Inscription des lecteurs (auto-enregistrement)
- ✅ Connexion sécurisée avec JWT
- ✅ Système de rôles: Directeur, Bibliothécaire, Lecteur
- ✅ Gestion des comptes utilisateur (CRUD)
- ✅ Profil utilisateur personnalisable

### Gestion des livres
- ✅ Ajout/modification/suppression de livres
- ✅ Recherche et filtrage par titre, auteur, ISBN, catégorie
- ✅ Gestion des stocks et disponibilité
- ✅ Historique des modifications

### Gestion des lecteurs
- ✅ Enregistrement complet des lecteurs
- ✅ Profil détaillé (contact, adresse, photo)
- ✅ Historique d'emprunts et consultations
- ✅ Suivi des pénalités et alertes

### Gestion des emprunts
- ✅ Création et enregistrement des emprunts
- ✅ Retours avec calcul automatique des pénalités
- ✅ Gestion des alertes de retard
- ✅ Renouvellement de prêts
- ✅ Historique complet des transactions

### Consultations sur place
- ✅ Enregistrement des consultations
- ✅ Durée de consultation
- ✅ Suivi par lecteur

### Statistiques & Rapports
- ✅ Tableau de bord global
- ✅ Statistiques en temps réel
- ✅ Graphiques interactifs
- ✅ Exports en PDF et Excel
- ✅ Rapports personnalisables

## 📋 Prérequis

### Avant de commencer, assurez-vous d'avoir installé:
- **Node.js** (v14.0.0 ou plus récent) - [Télécharger](https://nodejs.org/)
- **npm** ou **yarn** (généralement inclus avec Node.js)
- **MySQL** (v5.7 ou plus récent) - [Télécharger](https://www.mysql.com/downloads/)
- **Git** (optionnel) - [Télécharger](https://git-scm.com/)

### Vérifier les installations
```bash
node --version
npm --version
mysql --version
```

## 🚀 Installation complète

### Étape 1 : Cloner ou télécharger le projet
```bash
git clone <url-du-repo>
cd bibliotheque-uac
```

### Étape 2 : Configuration de la base de données

#### Créer la base de données MySQL:
```bash
mysql -u root -p
```

Dans le shell MySQL:
```sql
CREATE DATABASE bibliotheque_uac CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bibliotheque_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON bibliotheque_uac.* TO 'bibliotheque_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Initialiser les tables (optionnel - le backend le fera automatiquement):
```bash
mysql -u bibliotheque_user -p bibliotheque_uac < backend/bibliotheque_uac_init.sql
```

### Étape 3 : Installation du Backend

```bash
cd backend

# Copier et configurer le fichier .env
cp .env.example .env
```

**Éditer `.env` avec vos paramètres:**
```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bibliotheque_uac
DB_USER=bibliotheque_user
DB_PASS=votre_mot_de_passe

# JWT Secret (générer une clé secrète longue et aléatoire)
JWT_SECRET=votre_clé_secrète_très_longue_et_aléatoire

# Port du serveur
PORT=3333

# Environnement
NODE_ENV=development
```

**Installer les dépendances et lancer le serveur:**
```bash
npm install
npm run seed        # (Optionnel) Remplir la base avec des données de test
npm run dev         # Démarrer le serveur en mode développement
```

Le backend sera accessible sur `http://localhost:3333`

### Étape 4 : Installation du Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run start
```

Le frontend sera accessible sur `http://localhost:3000`

### Étape 5 : Installation et lancement d'Electron (Optionnel)

```bash
cd ../electron-app

# Installer les dépendances
npm install

# Lancer l'application Electron
npm start
```

## 📖 Gestion des utilisateurs et rôles

### Rôles disponibles

| Rôle | Permissions | Fonctionnalités |
|------|------------|-----------------|
| **Directeur** | Accès complet | Tout gérer : utilisateurs, paramètres, rapports |
| **Bibliothécaire** | Accès contrôlé | Gestion des livres, emprunts, lecteurs |
| **Lecteur** | Accès limité | Consulter son profil, historique d'emprunts |

### Premiers comptes de test
Lors du seed initial, les comptes suivants sont créés:

```
👤 Directeur
   Email: directeur@bibliotheque.com
   Mot de passe: directeur123

👤 Bibliothécaire
   Email: bibliothecaire@bibliotheque.com
   Mot de passe: bibliothecaire123

👤 Lecteur (exemple)
   Email: lecteur@bibliotheque.com
   Mot de passe: lecteur123
```

## 🌐 API Backend - Endpoints principaux

### Authentification
```
POST   /api/auth/login              - Connexion utilisateur
POST   /api/auth/register           - Enregistrement utilisateur (admin seulement)
POST   /api/auth/register-reader    - Auto-enregistrement lecteur
GET    /api/auth/users              - Lister tous les utilisateurs
PUT    /api/auth/profile            - Mettre à jour son profil
PUT    /api/auth/users/:id          - Mettre à jour un utilisateur
DELETE /api/auth/users/:id          - Supprimer un utilisateur
```

### Livres
```
GET    /api/books                   - Lister tous les livres
GET    /api/books/:id               - Récupérer un livre spécifique
POST   /api/books                   - Créer un nouveau livre
PUT    /api/books/:id               - Mettre à jour un livre
DELETE /api/books/:id               - Supprimer un livre
GET    /api/books/search?q=terme    - Rechercher des livres
```

### Lecteurs
```
GET    /api/readers                 - Lister tous les lecteurs
GET    /api/readers/:id             - Récupérer un lecteur spécifique
POST   /api/readers                 - Créer un nouveau lecteur
PUT    /api/readers/:id             - Mettre à jour un lecteur
DELETE /api/readers/:id             - Supprimer un lecteur
```

### Emprunts
```
GET    /api/loans                   - Lister tous les emprunts
POST   /api/loans                   - Créer un nouvel emprunt
GET    /api/loans/:id               - Récupérer un emprunt spécifique
PUT    /api/loans/:id/return        - Enregistrer le retour d'un livre
GET    /api/loans/overdue           - Lister les emprunts en retard
```

### Consultations
```
GET    /api/consultations           - Lister toutes les consultations
POST   /api/consultations           - Créer une consultation
GET    /api/consultations/:id       - Détails d'une consultation
```

### Statistiques
```
GET    /api/stats/dashboard         - Statistiques du tableau de bord
GET    /api/stats/books             - Statistiques des livres
GET    /api/stats/loans             - Statistiques des emprunts
GET    /api/stats/readers           - Statistiques des lecteurs
```

### Alertes
```
GET    /api/alerts                  - Lister toutes les alertes
POST   /api/alerts                  - Créer une alerte
PUT    /api/alerts/:id              - Mettre à jour une alerte
DELETE /api/alerts/:id              - Supprimer une alerte
```

### Activités
```
GET    /api/activities              - Lister l'historique des activités
```

## 📁 Structure du projet

```
bibliotheque-uac/
├── backend/                        # API Express + Base de données
│   ├── src/
│   │   ├── app.js                 # Configuration Express
│   │   ├── server.js              # Point d'entrée du serveur
│   │   ├── config/
│   │   │   └── db.js              # Configuration MySQL/Sequelize
│   │   ├── controllers/           # Logique métier
│   │   ├── models/                # Modèles Sequelize
│   │   ├── routes/                # Définition des endpoints
│   │   ├── middleware/            # Auth, validation
│   │   └── utils/                 # Utilitaires (seed, logging)
│   ├── package.json
│   ├── .env.example               # Modèle de configuration
│   └── bibliotheque_uac_init.sql   # Schéma de base de données
│
├── frontend/                       # Interface React + Vite
│   ├── src/
│   │   ├── App.jsx                # Composant racine
│   │   ├── pages/                 # Pages principales
│   │   ├── components/            # Composants réutilisables
│   │   ├── api/                   # Appels API Axios
│   │   ├── services/              # Services métier
│   │   ├── utils/                 # Utilitaires
│   │   └── styles/                # CSS global
│   ├── package.json
│   ├── tailwind.config.js          # Configuration Tailwind CSS
│   ├── vite.config.js              # Configuration Vite
│   └── public/                     # Fichiers statiques
│
├── electron-app/                   # Wrapper Electron
│   ├── main.js                    # Processus principal
│   ├── preload.js                 # Préchargement sécurisé
│   ├── package.json
│   └── electron-38-0-0/           # Binaires Electron
│
├── query/                         # Scripts SQL personnalisés
├── package.json                   # Root dependencies
└── README.md                      # Ce fichier
```

## 🎮 Utilisation

### Démarrer en développement (3 terminaux)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend accessible sur http://localhost:3333
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# Frontend accessible sur http://localhost:3000
```

**Terminal 3 - Electron (optionnel):**
```bash
cd electron-app
npm start
```

### Démarrer en production

**Backend:**
```bash
cd backend
npm install --production
npm start
```

**Frontend (Build):**
```bash
cd frontend
npm run build
# Les fichiers compilés sont dans `build/`
```

## 🔐 Sécurité

- ✅ **Authentification JWT** : Tokens sécurisés avec expiration
- ✅ **Hachage de mots de passe** : Utilise bcrypt avec salt
- ✅ **CORS** : Configuré pour accepter les requêtes légitimes
- ✅ **RBAC** : Contrôle d'accès basé sur les rôles
- ✅ **Variables d'environnement** : Pas de secrets en dur

## 🐛 Dépannage

### Erreur: "Cannot find module 'sequelize'"
```bash
cd backend
npm install
```

### Erreur: "MySQL connection failed"
- Vérifier que MySQL est lancé
- Vérifier les credentials dans `.env`
- Vérifier que la base de données existe: `SHOW DATABASES;`

### Erreur: "Port 3333 already in use"
- Changer le PORT dans `.env`
- Ou tuer le processus utilisant le port (Windows: `netstat -ano | findstr :3333`)

### Le frontend ne peut pas joindre le backend
- Vérifier que le backend est lancé sur `http://localhost:3333`
- Vérifier les en-têtes CORS dans `backend/src/app.js`
- Vérifier la variable `proxy` dans `frontend/package.json`

### Electron ne se lance pas
- Vérifier que Node.js est installé
- Vérifier que Electron est installé: `npm install` dans `electron-app/`
- Vérifier les chemins d'accès au binaire Electron

## 📚 Documentation supplémentaire

- **Backend détaillé** : Voir [backend/README_BACKEND.md](backend/README_BACKEND.md)
- **Guide PDF** : Voir [frontend/PDF_EXPORT_GUIDE.md](frontend/PDF_EXPORT_GUIDE.md)
- **Scripts de test** : Voir [backend/scripts/](backend/scripts/)

## 🤝 Contribution

Pour contribuer au projet:
1. Créer une branche feature (`git checkout -b feature/amelioration`)
2. Commiter vos changements (`git commit -am 'Ajout de...'`)
3. Pousser vers la branche (`git push origin feature/amelioration`)
4. Ouvrir une Pull Request

## 📝 Licence

Ce projet est fourni tel quel. Consultez votre institution pour les conditions d'utilisation.

## 💬 Support & Contact

Pour toute question ou problème:
- Consulter la documentation du backend: `backend/README_BACKEND.md`
- Vérifier les logs d'erreur en cas de problème
- Vérifier la console du navigateur (F12) pour les erreurs frontend

---

**Dernière mise à jour:** Mai 2026
**Version:** 1.0.0

