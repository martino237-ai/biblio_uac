// backend/src/controllers/consultationController.js
const { Consultation, Reader, Book } = require('../models');
const { Op } = require('sequelize');
const { logActivity } = require('../utils/activityLogger');

exports.getAllConsultations = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const start = req.query.start;
    const end = req.query.end;
    const where = {};

    // replicate loan filtering behaviour: only apply when both parameters
    if (start && end) {
      console.log('consultations filter dates', start, end);
      where.heure_debut = { [Op.between]: [new Date(start), new Date(end)] };
    }

    const include = [
      { model: Reader, as: 'Reader' },
      { model: Book, as: 'Book' }
    ];

    if (q) {
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

    const c = await Consultation.findAll({
      where,
      include,
      order: [['heure_debut', 'DESC']]
    });
    res.json(c);
  } catch (err) {
    console.error('consultations query failed', err.stack || err);
    res.status(500).json({ error: 'Erreur lecture consultations', detail: err.message });
  }
};

exports.createConsultation = async (req, res) => {
  const t = await Consultation.sequelize.transaction();
  try {
    const { lecteur_id, livre_id } = req.body;
    if (!lecteur_id) return res.status(400).json({ error: 'reader_id requis' });
    const reader = await Reader.findByPk(lecteur_id, { transaction: t });
    if (!reader) { await t.rollback(); return res.status(404).json({ error: 'Lecteur introuvable' }); }

    let book = null;
    if (livre_id) {
      book = await Book.findByPk(livre_id, { transaction: t });
      if (!book) { await t.rollback(); return res.status(404).json({ error: 'Livre introuvable' }); }
      if ((book.exemplaires_disponibles || 0) <= 0) {
        await t.rollback();
        return res.status(400).json({ error: 'Aucun exemplaire disponible pour consultation' });
      }
      // réserver un exemplaire
      book.exemplaires_disponibles = Math.max(0, (book.exemplaires_disponibles || book.total_exemplaires) - 1);
      await book.save({ transaction: t });
    }

    const c = await Consultation.create({ lecteur_id, livre_id: livre_id || null, heure_debut: new Date() }, { transaction: t });
    await t.commit();

    logActivity(req.user?.id, 'Nouvelle consultation', { id: c.id, lecteur_id, livre_id });
    const created = await Consultation.findByPk(c.id, {
      include: [{ model: Reader, as: 'Reader' }, { model: Book, as: 'Book' }]
    });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(500).json({ error: 'Erreur création consultation' });
  }
};

// Import en masse de consultations depuis un fichier Excel
exports.importConsultations = async (req, res) => {
  const rows = Array.isArray(req.body.rows) ? req.body.rows : [];
  let created = 0, updated = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i] || {};
    const rowNum = i + 2;
    try {
      const matricule = (r.matricule || '').toString().trim();
      const heure_debut = (r.heure_debut || '').toString().trim();
      if (!matricule || !heure_debut) { errors.push({ row: rowNum, message: 'matricule et heure_debut requis' }); continue; }

      const reader = await Reader.findOne({ where: { matricule } });
      if (!reader) { errors.push({ row: rowNum, message: `Lecteur introuvable (matricule ${matricule})` }); continue; }

      let livre_id = null;
      const codeLivre = (r.code_livre || '').toString().trim();
      if (codeLivre) {
        const book = await Book.findOne({ where: { code: codeLivre } });
        if (!book) { errors.push({ row: rowNum, message: `Livre introuvable (code ${codeLivre})` }); continue; }
        livre_id = book.id;
      }

      const payload = { lecteur_id: reader.id, livre_id, heure_debut, heure_fin: r.heure_fin || null };
      const existing = await Consultation.findOne({ where: { lecteur_id: reader.id, livre_id, heure_debut } });
      if (existing) {
        await existing.update(payload);
        updated++;
      } else {
        await Consultation.create(payload);
        created++;
      }
    } catch (err) {
      errors.push({ row: rowNum, message: err.message });
    }
  }

  logActivity(req.user?.id, 'Import consultations', { created, updated, errors: errors.length });
  res.json({ created, updated, errors });
};

exports.endConsultation = async (req, res) => {
  const t = await Consultation.sequelize.transaction();
  try {
    const c = await Consultation.findByPk(req.params.id, { transaction: t });
    if (!c) { await t.rollback(); return res.status(404).json({ error: 'Consultation introuvable' }); }
    c.heure_fin = new Date();
    await c.save({ transaction: t });

    if (c.livre_id) {
      const book = await Book.findByPk(c.livre_id, { transaction: t });
      if (book) {
        book.exemplaires_disponibles = Math.min(book.total_exemplaires, (book.exemplaires_disponibles || 0) + 1);
        await book.save({ transaction: t });
      }
    }

    await t.commit();

    logActivity(req.user?.id, 'Fin consultation', { id: c.id });
    const updated = await Consultation.findByPk(c.id, {
      include: [{ model: Reader, as: 'Reader' }, { model: Book, as: 'Book' }]
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    await t.rollback();
    res.status(400).json({ error: err.message });
  }
};
