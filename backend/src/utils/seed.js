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
        theme: 'Informatique',
        total_exemplaires: 5,
        exemplaires_disponibles: 5,
        emplacement: 'Rayon A1'
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0002' },
      defaults: {
        titre: 'Bases de Données',
        auteur: 'B. SQL',
        theme: 'Informatique',
        total_exemplaires: 3,
        exemplaires_disponibles: 3,
        emplacement: 'Rayon A1',
        type_ouvrage: 'livre',
        resume: 'Fondamentaux des bases de données relationnelles.',
        mots_cles: 'SQL, relations, schéma'
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-1001' },
      defaults: {
        titre: 'Revue Scientifique UAC',
        auteur: 'Équipe UAC',
        theme: 'Actualités scientifiques',
        total_exemplaires: 2,
        exemplaires_disponibles: 2,
        emplacement: 'Rayon P2',
        type_ouvrage: 'périodique',
        issn: '1234-5678',
        frequency: 'mensuel',
        issue_number: 42,
        volume_number: 5,
        issue_date: new Date('2024-03-01'),
        resume: 'Numéro du mois avec articles sur l’ingénierie et la santé.',
        mots_cles: 'science, recherche, université'
      }
    });

    await Book.findOrCreate({
      where: { code: 'UAC-0003' },
      defaults: {
        titre: 'Dictionnaire de Référence',
        auteur: 'C. Référence',
        theme: 'Référence',
        total_exemplaires: 4,
        exemplaires_disponibles: 4,
        emplacement: 'Rayon R1',
        type_ouvrage: 'ouvrage de référence',
        resume: 'Guide complet de références techniques pour étudiants et professeurs.',
        mots_cles: 'référence, guide, technique'
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
