const bcrypt = require('bcrypt');
const { sequelize, Book, Reader, Loan, Consultation, User } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // force to recreate tables

    // users (admin + biblio)
    const hashAdmin = await bcrypt.hash('password', 10);
    const hashBiblio = await bcrypt.hash('password', 10);

    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: { username: 'admin', password_hash: hashAdmin, role: 'directeur', nom: 'Administrateur' }
    });

    await User.findOrCreate({
      where: { username: 'biblio' },
      defaults: { username: 'biblio', password_hash: hashBiblio, role: 'bibliothecaire', nom: 'Bibliothécaire' }
    });

    // livres
    await Book.findOrCreate({
      where: { code: 'UAC-0001' },
      defaults: {
        titre: 'Introduction à la Programmation',
        auteur: 'A. Dev',
        editeur: 'Éditions UAC',
        annee_publication: 2023,
        edition: '2e édition',
        langue: 'Français',
        nombre_pages: 320,
        theme: 'Informatique',
        genre: 'Pédagogie',
        resume: 'Un guide progressif pour apprendre les bases de la programmation avec des exemples concrets et des exercices pratiques.',
        description: 'Ce livre présente les concepts essentiels comme les variables, les boucles, les fonctions et la gestion des erreurs. Il contient des exercices corrigés, des captures d’écran de code et des conseils pour écrire un code clair et maintenable.',
        mots_cles: 'programmation, algorithmique, débutant, code, JavaScript',
        total_exemplaires: 5,
        exemplaires_disponibles: 4,
        emplacement: 'Rayon A1',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/51E2055ZGUL._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B0FMPJDG51',
        amazon_rating: 4.6,
        amazon_reviews: 'Très bien structuré pour les débutants.\nLes exemples sont clairs et adaptés aux étudiants.\nUtilisé en cours comme manuel de référence.',
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0002' },
      defaults: {
        titre: 'Bases de Données',
        auteur: 'B. SQL',
        editeur: 'Tech Books',
        annee_publication: 2022,
        edition: '1re édition',
        langue: 'Français',
        nombre_pages: 280,
        theme: 'Informatique',
        genre: 'Technique',
        resume: 'Un ouvrage pratique sur la conception, le modèle relationnel, la normalisation et l’optimisation des requêtes.',
        description: 'Vous y trouverez des explications détaillées sur les schémas, les transactions, le SQL avancé et la sécurité des données. Idéal pour les étudiants en informatique et les professionnels qui veulent structurer des bases robustes.',
        mots_cles: 'SQL, MySQL, PostgreSQL, normalisation, index',
        total_exemplaires: 4,
        exemplaires_disponibles: 4,
        emplacement: 'Rayon A1',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/41jEbK-jG+L._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B01N6KD6Z4',
        amazon_rating: 4.5,
        amazon_reviews: 'Explications très complètes et exemples adaptés.\nLa section sur les transactions est particulièrement utile.',
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0003' },
      defaults: {
        titre: 'Dictionnaire de Référence Technique',
        auteur: 'C. Référence',
        editeur: 'Références UAC',
        annee_publication: 2021,
        edition: '3e édition',
        langue: 'Français',
        nombre_pages: 520,
        theme: 'Référence',
        type_ouvrage: 'ouvrage de référence',
        resume: 'Un dictionnaire complet des concepts et termes techniques en informatique et ingénierie.',
        description: 'Cet ouvrage rassemble définitions, acronyms et explications de plus de 500 termes courants. Il est conçu pour accompagner les étudiants et les enseignants lors de la préparation de cours, examens et projets.',
        mots_cles: 'dictionnaire, référence, vocabulaire, informatique',
        total_exemplaires: 4,
        exemplaires_disponibles: 3,
        emplacement: 'Rayon R1',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/51wOoOTeX3L._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B07XYZ1234',
        amazon_rating: 4.4,
        amazon_reviews: 'Très utile pour trouver rapidement une définition technique.\nFormat pratique pour la bibliothèque universitaire.',
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0004' },
      defaults: {
        titre: 'Développement Web Moderne',
        auteur: 'L. Front-end',
        editeur: 'WebPress',
        annee_publication: 2024,
        edition: '1re édition',
        langue: 'Français',
        nombre_pages: 360,
        theme: 'Informatique',
        genre: 'Développement',
        resume: 'Un parcours complet du développement web moderne avec HTML, CSS, JavaScript et frameworks front-end.',
        description: 'Le livre couvre la construction de sites responsives, l’accessibilité, les performances et les bonnes pratiques pour déployer des applications web fiables. Idéal pour les étudiants qui veulent maîtriser les outils actuels du web.',
        mots_cles: 'web, HTML, CSS, JavaScript, React, Vite',
        total_exemplaires: 3,
        exemplaires_disponibles: 3,
        emplacement: 'Rayon A2',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/51T8OXMiB5L._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B08L5RD9R7',
        amazon_rating: 4.7,
        amazon_reviews: 'Parfait pour comprendre les techniques modernes du web.\nIllustrations et exemples pratiques très appréciables.',
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0005' },
      defaults: {
        titre: 'Sécurité des Systèmes et Réseaux',
        auteur: 'S. Cyber',
        editeur: 'SécuriTech',
        annee_publication: 2023,
        edition: '2e édition',
        langue: 'Français',
        nombre_pages: 410,
        theme: 'Informatique',
        genre: 'Sécurité',
        resume: 'Un guide pratique pour protéger les systèmes, surveiller les menaces et appliquer des politiques de sécurité efficaces.',
        description: 'Ce livre fournit des études de cas sur les attaques récentes, des méthodes de chiffrement, la gestion des mots de passe et la sécurité des réseaux. Il inclut aussi des exercices pour comprendre les bonnes pratiques opérationnelles.',
        mots_cles: 'sécurité, réseau, cybersécurité, chiffrement, audit',
        total_exemplaires: 4,
        exemplaires_disponibles: 4,
        emplacement: 'Rayon B1',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/51pIbNlKvVL._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B09CYWQX4V',
        amazon_rating: 4.3,
        amazon_reviews: 'Contenu riche et concret.\nLes exemples de menaces réelles sont très utiles pour la préparation.',
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0006' },
      defaults: {
        titre: 'Intelligence Artificielle pour Débutants',
        auteur: 'M. IA',
        editeur: 'LivreLibre',
        annee_publication: 2025,
        edition: '1re édition',
        langue: 'Français',
        nombre_pages: 260,
        theme: 'Informatique',
        genre: 'Intelligence artificielle',
        resume: 'Une introduction accessible à l’intelligence artificielle, aux réseaux de neurones et aux cas d’usage en entreprise.',
        description: 'Ce livre gratuit présente les concepts de l’apprentissage supervisé, des modèles de classification et de la reconnaissance d’images. Il est conçu pour être lu sans prérequis avancés et inclut des exercices simples.',
        mots_cles: 'IA, machine learning, apprentissage, gratuit',
        total_exemplaires: 2,
        exemplaires_disponibles: 2,
        emplacement: 'Rayon C1',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/41rO5fzS9OL._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B09FREEBOOK',
        amazon_rating: 4.8,
        amazon_reviews: 'Idéal pour commencer sans se perdre.\nLe format gratuit est parfait pour un premier apprentissage.',
        gratuit: true
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0007' },
      defaults: {
        titre: 'Mathématiques Discrètes expliquées',
        auteur: 'D. Math',
        editeur: 'LivreLibre',
        annee_publication: 2024,
        edition: '1re édition',
        langue: 'Français',
        nombre_pages: 300,
        theme: 'Mathématiques',
        genre: 'Scientifique',
        resume: 'Un manuel gratuit pour maîtriser les structures discrètes, les graphes, et la logique utilisée en informatique.',
        description: 'Ce livre gratuit explique clairement les concepts de graphes, ensembles, fonctions et relations, avec des exemples d’application en algorithmique et cryptographie.',
        mots_cles: 'mathématiques, graphes, logique, gratuit',
        total_exemplaires: 2,
        exemplaires_disponibles: 2,
        emplacement: 'Rayon C2',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/51E8rMkzN+L._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B09FREEBOOK2',
        amazon_rating: 4.7,
        amazon_reviews: 'Très accessible même pour les étudiants en début de parcours.\nLa partie graphes est excellente.',
        gratuit: true
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0008' },
      defaults: {
        titre: 'Psychologie de l’Apprentissage',
        auteur: 'P. Cognitif',
        editeur: 'Sciences Humaines',
        annee_publication: 2023,
        edition: '1re édition',
        langue: 'Français',
        nombre_pages: 280,
        theme: 'Psychologie',
        genre: 'Pédagogie',
        resume: 'Une exploration des mécanismes cognitifs qui favorisent la mémorisation, la motivation et la réussite scolaire.',
        description: 'Le livre explique comment organiser ses révisions, utiliser les feedbacks et appliquer des stratégies d’apprentissage efficaces. Il s’adresse à tous les étudiants et formateurs.',
        mots_cles: 'psychologie, apprentissage, mémoire, motivation',
        total_exemplaires: 3,
        exemplaires_disponibles: 3,
        emplacement: 'Rayon D1',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/41vVdTvhEyL._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B08LEARN123',
        amazon_rating: 4.5,
        amazon_reviews: 'Analyse pertinente et exemples concrets.\nTrès utile pour améliorer ses méthodes d’étude.',
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0009' },
      defaults: {
        titre: 'Anglais Technique Professionnel',
        auteur: 'E. Lingua',
        editeur: 'Langues Pro',
        annee_publication: 2022,
        edition: '2e édition',
        langue: 'Français/Anglais',
        nombre_pages: 240,
        theme: 'Langues',
        genre: 'Technique',
        resume: 'Un guide bilingue pour maîtriser le vocabulaire professionnel en informatique, commerce et sciences.',
        description: 'Ce manuel inclut des fiches de vocabulaire, des dialogues professionnels et des exercices de traduction. Il est adapté aux étudiants et professionnels qui préparent des entretiens ou des rapports en anglais.',
        mots_cles: 'anglais, technique, vocabulaire, bilingue',
        total_exemplaires: 3,
        exemplaires_disponibles: 3,
        emplacement: 'Rayon E1',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/51T8OXMiB5L._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B07ENGLISH01',
        amazon_rating: 4.4,
        amazon_reviews: 'Très pratique pour l’anglais professionnel.\nLes traductions sont bien expliquées.',
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0010' },
      defaults: {
        titre: 'Développement Durable et Économie Circulaire',
        auteur: 'V. Vert',
        editeur: 'EcoPress',
        annee_publication: 2024,
        edition: '1re édition',
        langue: 'Français',
        nombre_pages: 310,
        theme: 'Environnement',
        genre: 'Éducation',
        resume: 'Un manuel sur les principes du développement durable, les bonnes pratiques et la gestion des ressources en économie circulaire.',
        description: 'Ce livre examine les solutions pour réduire les déchets, optimiser les ressources et appliquer des projets durables dans les entreprises et collectivités.',
        mots_cles: 'durable, recyclage, économie circulaire, écologie',
        total_exemplaires: 3,
        exemplaires_disponibles: 3,
        emplacement: 'Rayon F1',
        image_url: 'https://images-na.ssl-images-amazon.com/images/I/41rO5fzS9OL._SX376_BO1,204,203,200_.jpg',
        amazon_url: 'https://www.amazon.fr/dp/B09GREEN2024',
        amazon_rating: 4.6,
        amazon_reviews: 'Lecture inspirante et bien structurée.\nExcellent pour les projets de développement durable.',
      }
    });

    // lecteurs existants
    await Reader.findOrCreate({
      where: { matricule: 'UAC2024001' },
      defaults: {
        nom: 'Ngom',
        prenom: 'Jean',
        type: 'etudiant',
        faculte: 'FST',
        filiere: 'Informatique',
        niveau: 'L2',
        telephone: '+237600000001'
      }
    });

    await Reader.findOrCreate({
      where: { matricule: 'UAC2024002' },
      defaults: {
        nom: 'Eto',
        prenom: 'Marie',
        type: 'etudiant',
        faculte: 'Gestion',
        filiere: 'Management',
        niveau: 'L1',
        telephone: '+237600000002'
      }
    });

    // example student from the ISSS faculty we just added to dropdown
    await Reader.findOrCreate({
      where: { matricule: 'UAC2024010' },
      defaults: {
        nom: 'Kouam',
        prenom: 'Aline',
        type: 'etudiant',
        faculte: 'ISSS',
        filiere: 'Sciences infirmières',
        niveau: 'L2',
        telephone: '+237600000010'
      }
    });

    // compte de test lecteur (avec toutes les informations demandées)
    const testReader = await Reader.findOrCreate({
      where: { email: 'test.lecteur@uac.edu' },
      defaults: {
        nom: 'Test',
        prenom: 'Lecteur',
        type: 'etudiant',
        faculte: 'FST',
        filiere: 'Informatique',
        niveau: 'L3',
        telephone: '+237600000003',
        matricule: 'UAC2024999',
        email: 'test.lecteur@uac.edu',
        date_inscription: new Date()
      }
    });

    // create corresponding user if it does not exist
    const hashTest = await bcrypt.hash('password', 10);
    await User.findOrCreate({
      where: { username: 'test.lecteur@uac.edu' },
      defaults: {
        username: 'test.lecteur@uac.edu',
        password_hash: hashTest,
        role: 'lecteur',
        nom: 'Test Lecteur'
      }
    });

    // Ajout identifiant historique utilisé dans l'app
    await User.findOrCreate({
      where: { username: 'MART' },
      defaults: {
        username: 'MART',
        password_hash: hashTest,
        role: 'lecteur',
        nom: 'MART'
      }
    });

    // emprunt demo (si possible)
    const reader = await Reader.findOne({ where: { matricule: 'UAC2024001' } });
    const reader2 = await Reader.findOne({ where: { matricule: 'UAC2024002' } });
    const book = await Book.findOne({ where: { code: 'UAC-0001' } });
    const periodical = await Book.findOne({ where: { code: 'UAC-1001' } });
    const referenceBook = await Book.findOne({ where: { code: 'UAC-0003' } });

    if (reader && book) {
      await Loan.findOrCreate({
        where: { lecteur_id: reader.id, livre_id: book.id, date_emprunt: new Date().toISOString().slice(0,10) },
        defaults: {
          lecteur_id: reader.id,
          livre_id: book.id,
          date_emprunt: new Date().toISOString().slice(0,10),
          date_retour_prevue: new Date(Date.now() + 14*24*3600*1000).toISOString().slice(0,10),
          statut: 'emprunte',
          type_emprunt: 'normal'
        }
      });

      await Loan.findOrCreate({
        where: { lecteur_id: reader2.id, livre_id: referenceBook.id, date_emprunt: new Date(Date.now() - 18*24*3600*1000).toISOString().slice(0,10) },
        defaults: {
          lecteur_id: reader2.id,
          livre_id: referenceBook.id,
          date_emprunt: new Date(Date.now() - 18*24*3600*1000).toISOString().slice(0,10),
          date_retour_prevue: new Date(Date.now() - 4*24*3600*1000).toISOString().slice(0,10),
          statut: 'en_retard',
          type_emprunt: 'limite',
          prolongations: 1
        }
      });
    }

    if (reader && periodical) {
      await Consultation.findOrCreate({
        where: { lecteur_id: reader.id, livre_id: periodical.id, heure_debut: new Date(Date.now() - 2*3600*1000) },
        defaults: {
          lecteur_id: reader.id,
          livre_id: periodical.id,
          heure_debut: new Date(Date.now() - 2*3600*1000),
          heure_fin: new Date(Date.now() - 3600*1000)
        }
      });

      await Consultation.findOrCreate({
        where: { lecteur_id: reader2.id, livre_id: book.id, heure_debut: new Date(Date.now() - 4*3600*1000) },
        defaults: {
          lecteur_id: reader2.id,
          livre_id: book.id,
          heure_debut: new Date(Date.now() - 4*3600*1000),
          heure_fin: new Date(Date.now() - 3*3600*1000)
        }
      });
    }

    console.log('✅ Seed completed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed', err);
    process.exit(1);
  }
})();
