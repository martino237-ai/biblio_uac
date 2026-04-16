CREATE DATABASE IF NOT EXISTS bibliotheque_uac CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE bibliotheque_uac;

-- tables minimales, Sequelize gérera les colonnes created_at/updated_at
CREATE TABLE IF NOT EXISTS books (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  titre VARCHAR(300) NOT NULL,
  auteur VARCHAR(255),
  editeur VARCHAR(255),
  annee_publication INT,
  edition VARCHAR(100),
  langue VARCHAR(50),
  nombre_pages INT UNSIGNED,
  resume TEXT,
  theme VARCHAR(255),
  mots_cles TEXT,
  genre VARCHAR(100),
  type_ouvrage ENUM('livre', 'revue', 'ouvrage de référence', 'document académique', 'memoire', 'périodique') DEFAULT 'livre',
  etat ENUM('disponible', 'reparation') DEFAULT 'disponible',
  issn VARCHAR(20),
  volume_number INT UNSIGNED,
  issue_number INT UNSIGNED,
  issue_date DATE,
  frequency ENUM('hebdomadaire', 'mensuel', 'trimestriel', 'annuel', 'irrégulier'),
  date_acquisition DATE,
  total_exemplaires INT DEFAULT 1,
  exemplaires_disponibles INT DEFAULT 1,
  description TEXT,
  emplacement VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS readers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  matricule VARCHAR(100) UNIQUE,
  nom VARCHAR(150) NOT NULL,
  prenom VARCHAR(150) NOT NULL,
  type ENUM('etudiant','enseignant','personnel','autre') DEFAULT 'etudiant',
  faculte VARCHAR(150),
  filiere VARCHAR(150),
  niveau VARCHAR(50),
  email VARCHAR(200),
  telephone VARCHAR(50),
  date_inscription DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS loans (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lecteur_id INT UNSIGNED,
  livre_id INT UNSIGNED,
  date_emprunt DATE NOT NULL,
  date_retour_prevue DATE NOT NULL,
  type_emprunt ENUM('normal','prolonge','limite') NOT NULL DEFAULT 'normal',
  date_retour_effective DATE,
  prolongations INT UNSIGNED NOT NULL DEFAULT 0,
  statut ENUM('emprunte','retourne','en_retard') DEFAULT 'emprunte',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lecteur_id) REFERENCES readers(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (livre_id) REFERENCES books(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS consultations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lecteur_id INT UNSIGNED,
  livre_id INT UNSIGNED,
  date_debut DATETIME NOT NULL,
  date_fin DATETIME,
  note TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lecteur_id) REFERENCES readers(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (livre_id) REFERENCES books(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('bibliothecaire','directeur') DEFAULT 'bibliothecaire',
  nom VARCHAR(150),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activities (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT UNSIGNED,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;