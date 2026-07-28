// backend/src/controllers/loanController.js
const { Loan, Book, Reader, sequelize } = require('../models');
const { Op } = require('sequelize');
const { logActivity } = require('../utils/activityLogger');

exports.getAllLoans = async (req, res) => {
  try {
    // mettre à jour les statuts en retard avant de retourner
    await Loan.update(
      { statut: 'en_retard' },
      {
        where: {
          statut: 'emprunte',
          date_retour_prevue: { [Op.lt]: new Date() }
        }
      }
    );

    const q = (req.query.q || '').trim();
    const start = req.query.start;
    const end = req.query.end;
    const statut = req.query.statut;
    const where = {};

    if (start && end) {
      where.date_emprunt = { [Op.between]: [new Date(start), new Date(end)] };
    }

    if (statut) {
      where.statut = statut;
    }

    // build search condition using related models
    const include = [
      { model: Reader, as: 'Reader' },
      { model: Book, as: 'Book' }
    ];

    if (q) {
      // add sequelize where on associated models
      include = include.map(inc => {
        if (inc.model === Reader) {
          return {
            ...inc,
            where: {
              [Op.or]: [
                { nom: { [Op.like]: `%${q}%` } },
                { prenom: { [Op.like]: `%${q}%` } },
                { matricule: { [Op.like]: `%${q}%` } }
              ]
            },
            required: false
          };
        }
        if (inc.model === Book) {
          return {
            ...inc,
            where: {
              [Op.or]: [
                { titre: { [Op.like]: `%${q}%` } },
                { code: { [Op.like]: `%${q}%` } }
              ]
            },
            required: false
          };
        }
        return inc;
      });
    }

    const loans = await Loan.findAll({
      where,
      include,
      order: [['date_emprunt', 'DESC']]
    });
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lecture emprunts' });
  }
};

exports.createLoan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { lecteur_id, livre_id, date_emprunt, date_retour_prevue } = req.body;
    const type_emprunt = req.body.type_emprunt || 'normal';
    if (!lecteur_id || !livre_id || !date_emprunt || !date_retour_prevue) {
      await t.rollback();
      return res.status(400).json({ error: 'Champs manquants' });
    }
    if (!['normal','prolonge','limite'].includes(type_emprunt)) {
      await t.rollback();
      return res.status(400).json({ error: 'Type d\'emprunt invalide' });
    }

    const reader = await Reader.findByPk(lecteur_id, { transaction: t });
    if (!reader) { await t.rollback(); return res.status(404).json({ error: 'Lecteur introuvable' }); }

    const book = await Book.findByPk(livre_id, { transaction: t });
    if (!book) { await t.rollback(); return res.status(404).json({ error: 'Livre introuvable' }); }

    if ((book.exemplaires_disponibles || 0) <= 0) { await t.rollback(); return res.status(400).json({ error: 'Aucun exemplaire disponible' }); }

    const loan = await Loan.create({ lecteur_id, livre_id, date_emprunt, date_retour_prevue, type_emprunt }, { transaction: t });

    book.exemplaires_disponibles = Math.max(0, (book.exemplaires_disponibles || book.total_exemplaires) - 1);
    await book.save({ transaction: t });

    await t.commit();

    // log activity
    logActivity(req.user?.id, 'Nouvel emprunt', { loanId: loan.id, lecteur_id, livre_id });

    // renvoyer l'emprunt avec relations
    const created = await Loan.findByPk(loan.id, {
      include: [{ model: Reader, as: 'Reader' }, { model: Book, as: 'Book' }]
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: 'Erreur création emprunt' });
  }
};

exports.returnLoan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const loan = await Loan.findByPk(req.params.id, { transaction: t });
    if (!loan) { await t.rollback(); return res.status(404).json({ error: 'Emprunt introuvable' }); }

    loan.date_retour_effective = new Date();
    // si le retour est après la date prévue on marque en retard
    if (loan.date_retour_prevue && new Date(loan.date_retour_prevue) < loan.date_retour_effective) {
      loan.statut = 'en_retard';
    } else {
      loan.statut = 'retourne';
    }
    await loan.save({ transaction: t });

    const book = await Book.findByPk(loan.livre_id, { transaction: t });
    if (book) {
      book.exemplaires_disponibles = Math.min(book.total_exemplaires, (book.exemplaires_disponibles || 0) + 1);
      await book.save({ transaction: t });
    }

    await t.commit();

    logActivity(req.user?.id, 'Restituer emprunt', { loanId: loan.id, statut: loan.statut });

    const updated = await Loan.findByPk(loan.id, {
      include: [{ model: Reader, as: 'Reader' }, { model: Book, as: 'Book' }]
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: 'Erreur mise à jour emprunt' });
  }
};

// Import en masse d'emprunts depuis un fichier Excel
// (upsert par lecteur + livre + date d'emprunt ; ne touche pas aux quantités
// disponibles des livres, destiné à une saisie/migration de données historiques)
exports.importLoans = async (req, res) => {
  const rows = Array.isArray(req.body.rows) ? req.body.rows : [];
  let created = 0, updated = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i] || {};
    const rowNum = i + 2;
    try {
      const matricule = (r.matricule || '').toString().trim();
      const codeLivre = (r.code_livre || '').toString().trim();
      const date_emprunt = (r.date_emprunt || '').toString().trim();
      const date_retour_prevue = (r.date_retour_prevue || '').toString().trim();

      if (!matricule || !codeLivre || !date_emprunt || !date_retour_prevue) {
        errors.push({ row: rowNum, message: 'matricule, code_livre, date_emprunt et date_retour_prevue requis' });
        continue;
      }

      const reader = await Reader.findOne({ where: { matricule } });
      if (!reader) { errors.push({ row: rowNum, message: `Lecteur introuvable (matricule ${matricule})` }); continue; }

      const book = await Book.findOne({ where: { code: codeLivre } });
      if (!book) { errors.push({ row: rowNum, message: `Livre introuvable (code ${codeLivre})` }); continue; }

      const payload = {
        lecteur_id: reader.id,
        livre_id: book.id,
        date_emprunt,
        date_retour_prevue,
        type_emprunt: ['normal', 'prolonge', 'limite'].includes(r.type_emprunt) ? r.type_emprunt : 'normal',
        statut: ['emprunte', 'retourne', 'en_retard'].includes(r.statut) ? r.statut : 'emprunte',
        date_retour_effective: r.date_retour_effective || null
      };

      const existing = await Loan.findOne({ where: { lecteur_id: reader.id, livre_id: book.id, date_emprunt } });
      if (existing) {
        await existing.update(payload);
        updated++;
      } else {
        await Loan.create(payload);
        created++;
      }
    } catch (err) {
      errors.push({ row: rowNum, message: err.message });
    }
  }

  logActivity(req.user?.id, 'Import emprunts', { created, updated, errors: errors.length });
  res.json({ created, updated, errors });
};

exports.renewLoan = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const loan = await Loan.findByPk(req.params.id, { transaction: t });
    if (!loan) { await t.rollback(); return res.status(404).json({ error: 'Emprunt introuvable' }); }
    if (loan.statut !== 'emprunte') { await t.rollback(); return res.status(400).json({ error: 'Seuls les emprunts en cours peuvent être prolongés' }); }

    const maxRenewals = 2;
    if (loan.prolongations >= maxRenewals) {
      await t.rollback();
      return res.status(400).json({ error: `Prolongation max (${maxRenewals}) atteinte` });
    }

    const currentDate = new Date();
    if (new Date(loan.date_retour_prevue) < currentDate) {
      await t.rollback();
      return res.status(400).json({ error: 'Impossible de prolonger un emprunt déjà en retard' });
    }

    const extensionDays = 7;
    const newReturnDate = new Date(loan.date_retour_prevue);
    newReturnDate.setDate(newReturnDate.getDate() + extensionDays);

    loan.date_retour_prevue = newReturnDate.toISOString().slice(0, 10);
    loan.prolongations += 1;
    await loan.save({ transaction: t });

    await t.commit();
    logActivity(req.user?.id, 'Prolonger emprunt', { loanId: loan.id, nouvelles_prolongations: loan.prolongations });

    const updatedLoan = await Loan.findByPk(loan.id, {
      include: [{ model: Reader, as: 'Reader' }, { model: Book, as: 'Book' }]
    });
    res.json(updatedLoan);
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: 'Erreur prolongation emprunt' });
  }
};
