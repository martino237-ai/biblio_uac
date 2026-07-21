-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 21 juil. 2026 à 16:06
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bibliotheque_uac`
--

-- --------------------------------------------------------

--
-- Structure de la table `activities`
--

CREATE TABLE `activities` (
  `id` int(10) UNSIGNED NOT NULL,
  `utilisateur_id` int(10) UNSIGNED DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `activities`
--

INSERT INTO `activities` (`id`, `utilisateur_id`, `action`, `details`, `created_at`, `updated_at`) VALUES
(1, 2, 'Connexion', '{\"username\":\"biblio\"}', '2026-06-20 20:46:17', '2026-06-20 20:46:17'),
(2, 4, 'Connexion', '{\"username\":\"MART\"}', '2026-06-20 20:47:50', '2026-06-20 20:47:50'),
(3, 2, 'Connexion', '{\"username\":\"biblio\"}', '2026-06-20 20:59:59', '2026-06-20 20:59:59'),
(4, 4, 'Connexion', '{\"username\":\"MART\"}', '2026-06-20 21:01:49', '2026-06-20 21:01:49'),
(5, 4, 'Connexion', '{\"username\":\"MART\"}', '2026-06-20 21:06:20', '2026-06-20 21:06:20'),
(6, NULL, 'Créer lecteur', '{\"id\":5,\"nom\":\"MARTIN\"}', '2026-06-20 21:08:20', '2026-06-20 21:08:20'),
(7, 5, 'Inscription lecteur', '{\"readerId\":5,\"username\":\"Martin\"}', '2026-06-20 21:08:57', '2026-06-20 21:08:57'),
(8, 2, 'Connexion', '{\"username\":\"biblio\"}', '2026-06-20 21:11:20', '2026-06-20 21:11:20'),
(9, 2, 'Nouvel emprunt', '{\"loanId\":3,\"lecteur_id\":\"5\",\"livre_id\":\"2\"}', '2026-06-20 21:12:35', '2026-06-20 21:12:35'),
(10, 2, 'Nouvelle consultation', '{\"id\":1,\"lecteur_id\":\"5\",\"livre_id\":\"2\"}', '2026-06-20 21:13:47', '2026-06-20 21:13:47'),
(11, 5, 'Connexion', '{\"username\":\"Martin\"}', '2026-06-20 21:16:16', '2026-06-20 21:16:16'),
(12, 5, 'Connexion', '{\"username\":\"Martin\"}', '2026-06-20 22:26:19', '2026-06-20 22:26:19'),
(13, 2, 'Connexion', '{\"username\":\"biblio\"}', '2026-06-20 23:40:14', '2026-06-20 23:40:14'),
(14, 5, 'Connexion', '{\"username\":\"Martin\"}', '2026-06-20 23:41:08', '2026-06-20 23:41:08'),
(15, 2, 'Connexion', '{\"username\":\"biblio\"}', '2026-06-21 14:33:13', '2026-06-21 14:33:13'),
(16, 2, 'Nouvel emprunt', '{\"loanId\":4,\"lecteur_id\":\"5\",\"livre_id\":\"2\"}', '2026-06-21 14:35:14', '2026-06-21 14:35:14'),
(17, 2, 'Nouvelle consultation', '{\"id\":2,\"lecteur_id\":\"5\",\"livre_id\":\"2\"}', '2026-06-21 14:36:27', '2026-06-21 14:36:27'),
(18, 2, 'Nouvelle consultation', '{\"id\":3,\"lecteur_id\":\"1\",\"livre_id\":\"4\"}', '2026-06-21 14:37:13', '2026-06-21 14:37:13'),
(19, 1, 'Connexion', '{\"username\":\"admin\"}', '2026-06-21 14:38:47', '2026-06-21 14:38:47'),
(20, 2, 'Connexion', '{\"username\":\"biblio\"}', '2026-06-21 14:40:12', '2026-06-21 14:40:12'),
(21, 2, 'Fin consultation', '{\"id\":1}', '2026-06-21 14:40:28', '2026-06-21 14:40:28'),
(22, 1, 'Connexion', '{\"username\":\"admin\"}', '2026-06-21 14:40:46', '2026-06-21 14:40:46'),
(23, 5, 'Connexion', '{\"username\":\"Martin\"}', '2026-06-21 14:41:50', '2026-06-21 14:41:50'),
(24, 2, 'Connexion', '{\"username\":\"biblio\"}', '2026-07-07 20:20:01', '2026-07-07 20:20:01'),
(25, 5, 'Connexion', '{\"username\":\"Martin\"}', '2026-07-08 14:35:33', '2026-07-08 14:35:33'),
(26, 2, 'Connexion', '{\"username\":\"biblio\"}', '2026-07-08 14:41:38', '2026-07-08 14:41:38'),
(27, 1, 'Connexion', '{\"username\":\"admin\"}', '2026-07-08 14:45:10', '2026-07-08 14:45:10'),
(28, 1, 'Connexion', '{\"username\":\"admin\"}', '2026-07-17 15:15:49', '2026-07-17 15:15:49'),
(29, 5, 'Connexion', '{\"username\":\"Martin\"}', '2026-07-17 15:17:50', '2026-07-17 15:17:50'),
(30, 5, 'Connexion', '{\"username\":\"Martin\"}', '2026-07-21 14:00:44', '2026-07-21 14:00:44');

-- --------------------------------------------------------

--
-- Structure de la table `books`
--

CREATE TABLE `books` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(100) NOT NULL,
  `titre` varchar(300) NOT NULL,
  `auteur` varchar(255) DEFAULT NULL,
  `editeur` varchar(255) DEFAULT NULL,
  `annee_publication` int(11) DEFAULT NULL,
  `edition` varchar(100) DEFAULT NULL,
  `langue` varchar(50) DEFAULT NULL,
  `nombre_pages` int(10) UNSIGNED DEFAULT NULL,
  `resume` text DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `mots_cles` text DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `issn` varchar(20) DEFAULT NULL,
  `volume_number` int(10) UNSIGNED DEFAULT NULL,
  `issue_number` int(10) UNSIGNED DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `frequency` enum('hebdomadaire','mensuel','trimestriel','annuel','irrégulier') DEFAULT NULL,
  `type_ouvrage` enum('livre','revue','ouvrage de référence','document académique','memoire','périodique') DEFAULT 'livre',
  `etat` enum('disponible','reparation') DEFAULT 'disponible',
  `date_acquisition` date DEFAULT NULL,
  `total_exemplaires` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `exemplaires_disponibles` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `amazon_url` varchar(500) DEFAULT NULL,
  `amazon_rating` decimal(2,1) DEFAULT NULL,
  `amazon_reviews` text DEFAULT NULL,
  `gratuit` tinyint(1) NOT NULL DEFAULT 0,
  `emplacement` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `books`
--

INSERT INTO `books` (`id`, `code`, `titre`, `auteur`, `editeur`, `annee_publication`, `edition`, `langue`, `nombre_pages`, `resume`, `theme`, `mots_cles`, `genre`, `issn`, `volume_number`, `issue_number`, `issue_date`, `frequency`, `type_ouvrage`, `etat`, `date_acquisition`, `total_exemplaires`, `exemplaires_disponibles`, `description`, `image_url`, `amazon_url`, `amazon_rating`, `amazon_reviews`, `gratuit`, `emplacement`, `createdAt`, `updatedAt`) VALUES
(1, 'UAC-0001', 'Introduction à la Programmation', 'A. Dev', 'Éditions UAC', 2023, '2e édition', 'Français', 320, 'Un guide progressif pour apprendre les bases de la programmation avec des exemples concrets et des exercices pratiques.', 'Informatique', 'programmation, algorithmique, débutant, code, JavaScript', 'Pédagogie', NULL, NULL, NULL, NULL, NULL, 'livre', 'disponible', NULL, 5, 4, 'Ce livre présente les concepts essentiels comme les variables, les boucles, les fonctions et la gestion des erreurs. Il contient des exercices corrigés, des captures d’écran de code et des conseils pour écrire un code clair et maintenable.', 'https://placehold.co/220x330?text=Intro+Programmation', 'https://www.amazon.fr/dp/B0FMPJDG51', 4.6, 'Très bien structuré pour les débutants.\nLes exemples sont clairs et adaptés aux étudiants.\nUtilisé en cours comme manuel de référence.', 0, 'Rayon A1', '2026-05-03 13:39:35', '2026-05-03 13:39:35'),
(2, 'UAC-0002', 'Bases de Données', 'B. SQL', 'Tech Books', 2022, '1re édition', 'Français', 280, 'Un ouvrage pratique sur la conception, le modèle relationnel, la normalisation et l’optimisation des requêtes.', 'Informatique', 'SQL, MySQL, PostgreSQL, normalisation, index', 'Technique', NULL, NULL, NULL, NULL, NULL, 'livre', 'disponible', NULL, 4, 1, 'Vous y trouverez des explications détaillées sur les schémas, les transactions, le SQL avancé et la sécurité des données. Idéal pour les étudiants en informatique et les professionnels qui veulent structurer des bases robustes.', 'https://placehold.co/220x330?text=Bases+de+Donnees', 'https://www.amazon.fr/dp/B01N6KD6Z4', 4.5, 'Explications très complètes et exemples adaptés.\nLa section sur les transactions est particulièrement utile.', 0, 'Rayon A1', '2026-05-03 13:39:35', '2026-06-21 14:40:28'),
(3, 'UAC-0003', 'Dictionnaire de Référence Technique', 'C. Référence', 'Références UAC', 2021, '3e édition', 'Français', 520, 'Un dictionnaire complet des concepts et termes techniques en informatique et ingénierie.', 'Référence', 'dictionnaire, référence, vocabulaire, informatique', NULL, NULL, NULL, NULL, NULL, NULL, 'ouvrage de référence', 'disponible', NULL, 4, 3, 'Cet ouvrage rassemble définitions, acronyms et explications de plus de 500 termes courants. Il est conçu pour accompagner les étudiants et les enseignants lors de la préparation de cours, examens et projets.', 'https://placehold.co/220x330?text=Dictionnaire+Ref', 'https://www.amazon.fr/dp/B07XYZ1234', 4.4, 'Très utile pour trouver rapidement une définition technique.\nFormat pratique pour la bibliothèque universitaire.', 0, 'Rayon R1', '2026-05-03 13:39:35', '2026-05-03 13:39:35'),
(4, 'UAC-0004', 'Développement Web Moderne', 'L. Front-end', 'WebPress', 2024, '1re édition', 'Français', 360, 'Un parcours complet du développement web moderne avec HTML, CSS, JavaScript et frameworks front-end.', 'Informatique', 'web, HTML, CSS, JavaScript, React, Vite', 'Développement', NULL, NULL, NULL, NULL, NULL, 'livre', 'disponible', NULL, 3, 2, 'Le livre couvre la construction de sites responsives, l’accessibilité, les performances et les bonnes pratiques pour déployer des applications web fiables. Idéal pour les étudiants qui veulent maîtriser les outils actuels du web.', 'https://placehold.co/220x330?text=Web+Moderne', 'https://www.amazon.fr/dp/B08L5RD9R7', 4.7, 'Parfait pour comprendre les techniques modernes du web.\nIllustrations et exemples pratiques très appréciables.', 0, 'Rayon A2', '2026-05-03 13:39:36', '2026-06-21 14:37:13'),
(5, 'UAC-0005', 'Sécurité des Systèmes et Réseaux', 'S. Cyber', 'SécuriTech', 2023, '2e édition', 'Français', 410, 'Un guide pratique pour protéger les systèmes, surveiller les menaces et appliquer des politiques de sécurité efficaces.', 'Informatique', 'sécurité, réseau, cybersécurité, chiffrement, audit', 'Sécurité', NULL, NULL, NULL, NULL, NULL, 'livre', 'disponible', NULL, 4, 4, 'Ce livre fournit des études de cas sur les attaques récentes, des méthodes de chiffrement, la gestion des mots de passe et la sécurité des réseaux. Il inclut aussi des exercices pour comprendre les bonnes pratiques opérationnelles.', 'https://placehold.co/220x330?text=Secu+Reseaux', 'https://www.amazon.fr/dp/B09CYWQX4V', 4.3, 'Contenu riche et concret.\nLes exemples de menaces réelles sont très utiles pour la préparation.', 0, 'Rayon B1', '2026-05-03 13:39:36', '2026-05-03 13:39:36'),
(6, 'UAC-0006', 'Intelligence Artificielle pour Débutants', 'M. IA', 'LivreLibre', 2025, '1re édition', 'Français', 260, 'Une introduction accessible à l’intelligence artificielle, aux réseaux de neurones et aux cas d’usage en entreprise.', 'Informatique', 'IA, machine learning, apprentissage, gratuit', 'Intelligence artificielle', NULL, NULL, NULL, NULL, NULL, 'livre', 'disponible', NULL, 2, 2, 'Ce livre gratuit présente les concepts de l’apprentissage supervisé, des modèles de classification et de la reconnaissance d’images. Il est conçu pour être lu sans prérequis avancés et inclut des exercices simples.', 'https://placehold.co/220x330?text=IA+Debutants', 'https://www.amazon.fr/dp/B09FREEBOOK', 4.8, 'Idéal pour commencer sans se perdre.\nLe format gratuit est parfait pour un premier apprentissage.', 1, 'Rayon C1', '2026-05-03 13:39:36', '2026-05-03 13:39:36'),
(7, 'UAC-0007', 'Mathématiques Discrètes expliquées', 'D. Math', 'LivreLibre', 2024, '1re édition', 'Français', 300, 'Un manuel gratuit pour maîtriser les structures discrètes, les graphes, et la logique utilisée en informatique.', 'Mathématiques', 'mathématiques, graphes, logique, gratuit', 'Scientifique', NULL, NULL, NULL, NULL, NULL, 'livre', 'disponible', NULL, 2, 2, 'Ce livre gratuit explique clairement les concepts de graphes, ensembles, fonctions et relations, avec des exemples d’application en algorithmique et cryptographie.', 'https://placehold.co/220x330?text=Mathematiques+Discretes', 'https://www.amazon.fr/dp/B09FREEBOOK2', 4.7, 'Très accessible même pour les étudiants en début de parcours.\nLa partie graphes est excellente.', 1, 'Rayon C2', '2026-05-03 13:39:36', '2026-05-03 13:39:36'),
(8, 'UAC-0008', 'Psychologie de l’Apprentissage', 'P. Cognitif', 'Sciences Humaines', 2023, '1re édition', 'Français', 280, 'Une exploration des mécanismes cognitifs qui favorisent la mémorisation, la motivation et la réussite scolaire.', 'Psychologie', 'psychologie, apprentissage, mémoire, motivation', 'Pédagogie', NULL, NULL, NULL, NULL, NULL, 'livre', 'disponible', NULL, 3, 3, 'Le livre explique comment organiser ses révisions, utiliser les feedbacks et appliquer des stratégies d’apprentissage efficaces. Il s’adresse à tous les étudiants et formateurs.', 'https://placehold.co/220x330?text=Psychologie+Apprentissage', 'https://www.amazon.fr/dp/B08LEARN123', 4.5, 'Analyse pertinente et exemples concrets.\nTrès utile pour améliorer ses méthodes d’étude.', 0, 'Rayon D1', '2026-05-03 13:39:36', '2026-05-03 13:39:36'),
(9, 'UAC-0009', 'Anglais Technique Professionnel', 'E. Lingua', 'Langues Pro', 2022, '2e édition', 'Français/Anglais', 240, 'Un guide bilingue pour maîtriser le vocabulaire professionnel en informatique, commerce et sciences.', 'Langues', 'anglais, technique, vocabulaire, bilingue', 'Technique', NULL, NULL, NULL, NULL, NULL, 'livre', 'disponible', NULL, 3, 3, 'Ce manuel inclut des fiches de vocabulaire, des dialogues professionnels et des exercices de traduction. Il est adapté aux étudiants et professionnels qui préparent des entretiens ou des rapports en anglais.', 'https://placehold.co/220x330?text=Anglais+Technique', 'https://www.amazon.fr/dp/B07ENGLISH01', 4.4, 'Très pratique pour l’anglais professionnel.\nLes traductions sont bien expliquées.', 0, 'Rayon E1', '2026-05-03 13:39:36', '2026-05-03 13:39:36'),
(10, 'UAC-0010', 'Développement Durable et Économie Circulaire', 'V. Vert', 'EcoPress', 2024, '1re édition', 'Français', 310, 'Un manuel sur les principes du développement durable, les bonnes pratiques et la gestion des ressources en économie circulaire.', 'Environnement', 'durable, recyclage, économie circulaire, écologie', 'Éducation', NULL, NULL, NULL, NULL, NULL, 'livre', 'disponible', NULL, 3, 3, 'Ce livre examine les solutions pour réduire les déchets, optimiser les ressources et appliquer des projets durables dans les entreprises et collectivités.', 'https://placehold.co/220x330?text=Developpement+Durable', 'https://www.amazon.fr/dp/B09GREEN2024', 4.6, 'Lecture inspirante et bien structurée.\nExcellent pour les projets de développement durable.', 0, 'Rayon F1', '2026-05-03 13:39:36', '2026-05-03 13:39:36');

-- --------------------------------------------------------

--
-- Structure de la table `consultations`
--

CREATE TABLE `consultations` (
  `id` int(10) UNSIGNED NOT NULL,
  `lecteur_id` int(10) UNSIGNED DEFAULT NULL,
  `livre_id` int(10) UNSIGNED DEFAULT NULL,
  `heure_debut` datetime NOT NULL,
  `heure_fin` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `consultations`
--

INSERT INTO `consultations` (`id`, `lecteur_id`, `livre_id`, `heure_debut`, `heure_fin`, `createdAt`, `updatedAt`) VALUES
(1, 5, 2, '2026-06-20 21:13:47', '2026-06-21 14:40:28', '2026-06-20 21:13:47', '2026-06-21 14:40:28'),
(2, 5, 2, '2026-06-21 14:36:27', NULL, '2026-06-21 14:36:27', '2026-06-21 14:36:27'),
(3, 1, 4, '2026-06-21 14:37:13', NULL, '2026-06-21 14:37:13', '2026-06-21 14:37:13');

-- --------------------------------------------------------

--
-- Structure de la table `lecteurs`
--

CREATE TABLE `lecteurs` (
  `id` int(11) NOT NULL,
  `matricule` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `faculte` varchar(255) DEFAULT NULL,
  `niveau` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `loans`
--

CREATE TABLE `loans` (
  `id` int(10) UNSIGNED NOT NULL,
  `lecteur_id` int(10) UNSIGNED DEFAULT NULL,
  `livre_id` int(10) UNSIGNED DEFAULT NULL,
  `date_emprunt` date NOT NULL,
  `date_retour_prevue` date NOT NULL,
  `type_emprunt` enum('normal','prolonge','limite') NOT NULL DEFAULT 'normal',
  `date_retour_effective` date DEFAULT NULL,
  `prolongations` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `statut` enum('emprunte','retourne','en_retard') NOT NULL DEFAULT 'emprunte',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `loans`
--

INSERT INTO `loans` (`id`, `lecteur_id`, `livre_id`, `date_emprunt`, `date_retour_prevue`, `type_emprunt`, `date_retour_effective`, `prolongations`, `statut`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2026-05-03', '2026-05-17', 'normal', NULL, 0, 'en_retard', '2026-05-03 13:39:43', '2026-06-20 20:46:19'),
(2, 2, 3, '2026-04-15', '2026-04-29', 'limite', NULL, 1, 'en_retard', '2026-05-03 13:39:43', '2026-05-03 13:39:43'),
(3, 5, 2, '2026-06-20', '2026-06-21', 'normal', NULL, 0, 'en_retard', '2026-06-20 21:12:35', '2026-07-07 20:20:03'),
(4, 5, 2, '2026-06-21', '2026-06-22', 'prolonge', NULL, 0, 'en_retard', '2026-06-21 14:35:14', '2026-07-07 20:20:03');

-- --------------------------------------------------------

--
-- Structure de la table `readers`
--

CREATE TABLE `readers` (
  `id` int(10) UNSIGNED NOT NULL,
  `matricule` varchar(100) DEFAULT NULL,
  `nom` varchar(150) NOT NULL,
  `prenom` varchar(150) NOT NULL,
  `type` enum('etudiant','enseignant','personnel','autre') NOT NULL DEFAULT 'etudiant',
  `faculte` varchar(150) DEFAULT NULL,
  `filiere` varchar(150) DEFAULT NULL,
  `niveau` varchar(50) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `date_inscription` date DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `readers`
--

INSERT INTO `readers` (`id`, `matricule`, `nom`, `prenom`, `type`, `faculte`, `filiere`, `niveau`, `email`, `telephone`, `date_inscription`, `created_at`, `updated_at`) VALUES
(1, 'UAC2024001', 'Ngom', 'Jean', 'etudiant', 'FST', 'Informatique', 'L2', NULL, '+237600000001', NULL, '2026-05-03 13:39:36', '2026-05-03 13:39:36'),
(2, 'UAC2024002', 'Eto', 'Marie', 'etudiant', 'Gestion', 'Management', 'L1', NULL, '+237600000002', NULL, '2026-05-03 13:39:36', '2026-05-03 13:39:36'),
(3, 'UAC2024010', 'Kouam', 'Aline', 'etudiant', 'ISSS', 'Sciences infirmières', 'L2', NULL, '+237600000010', NULL, '2026-05-03 13:39:36', '2026-05-03 13:39:36'),
(4, 'UAC2024999', 'Test', 'Lecteur', 'etudiant', 'FST', 'Informatique', 'L3', 'test.lecteur@uac.edu', '+237600000003', '2026-05-03', '2026-05-03 13:39:36', '2026-05-03 13:39:36'),
(5, 'Lé2023GLSI0139', 'MARTIN', 'EBOLO', 'etudiant', 'Gestion et Informatique', 'Génie logiciel', 'L3', 'egh@gm.com', '56787544', NULL, '2026-06-20 21:08:20', '2026-06-20 21:08:20');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `role` enum('bibliothecaire','directeur','lecteur') NOT NULL DEFAULT 'bibliothecaire',
  `nom` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `email`, `role`, `nom`) VALUES
(1, 'admin', '$2b$10$zsKsoIibq50n.wlVRUMGSusMp2b0zwHEWj2CNzY87e.eoWqA5sgby', NULL, 'directeur', 'Administrateur'),
(2, 'biblio', '$2b$10$sdbBFLuRWEzy7WOiJaO6Iei9/.Ik.O6wfrbPs6bPAajX7Q7qQMfqu', NULL, 'bibliothecaire', 'Bibliothécaire'),
(3, 'test.lecteur@uac.edu', '$2b$10$6.0j4eE/cvMNGRnuhzvkXucAvSdNxR2t4GSnGjNFlwQjkbt1XYOtq', NULL, 'lecteur', 'Test Lecteur'),
(4, 'MART', '$2b$10$6.0j4eE/cvMNGRnuhzvkXucAvSdNxR2t4GSnGjNFlwQjkbt1XYOtq', NULL, 'lecteur', 'MART'),
(5, 'Martin', '$2b$10$/sIudrMZJ0Bv61KnOYUpi.R7huy93DfGyizGXbIk2Q4nAoA/8Sc56', NULL, 'lecteur', 'MARTIN EBOLO');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Index pour la table `consultations`
--
ALTER TABLE `consultations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lecteur_id` (`lecteur_id`),
  ADD KEY `livre_id` (`livre_id`);

--
-- Index pour la table `lecteurs`
--
ALTER TABLE `lecteurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricule` (`matricule`),
  ADD UNIQUE KEY `matricule_2` (`matricule`),
  ADD UNIQUE KEY `matricule_3` (`matricule`),
  ADD UNIQUE KEY `matricule_4` (`matricule`),
  ADD UNIQUE KEY `matricule_5` (`matricule`),
  ADD UNIQUE KEY `matricule_6` (`matricule`),
  ADD UNIQUE KEY `matricule_7` (`matricule`),
  ADD UNIQUE KEY `matricule_8` (`matricule`);

--
-- Index pour la table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lecteur_id` (`lecteur_id`),
  ADD KEY `livre_id` (`livre_id`);

--
-- Index pour la table `readers`
--
ALTER TABLE `readers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricule` (`matricule`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `consultations`
--
ALTER TABLE `consultations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `lecteurs`
--
ALTER TABLE `lecteurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `readers`
--
ALTER TABLE `readers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `consultations`
--
ALTER TABLE `consultations`
  ADD CONSTRAINT `consultations_ibfk_1` FOREIGN KEY (`lecteur_id`) REFERENCES `readers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `consultations_ibfk_2` FOREIGN KEY (`livre_id`) REFERENCES `books` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`lecteur_id`) REFERENCES `readers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`livre_id`) REFERENCES `books` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
