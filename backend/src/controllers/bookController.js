const { Book } = require('../models');
const { Op } = require('sequelize');
const { logActivity } = require('../utils/activityLogger');

exports.getAllBooks = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const type = req.query.type;
    const where = {};
    if (q) {
      where[Op.or] = [
        { titre: { [Op.like]: `%${q}%` } },
        { auteur: { [Op.like]: `%${q}%` } },
        { code: { [Op.like]: `%${q}%` } },
        { theme: { [Op.like]: `%${q}%` } },
        { emplacement: { [Op.like]: `%${q}%` } }
      ];
    }
    if (type) {
      where.type_ouvrage = type;
    }
    const books = await Book.findAll({ where, order: [['titre', 'ASC']] });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lecture livres' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const b = await Book.findByPk(req.params.id);
    if (!b) return res.status(404).json({ error: 'Livre introuvable' });
    res.json(b);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createBook = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.titre || !payload.code) return res.status(400).json({ error: 'code et titre requis' });
    payload.exemplaires_disponibles = payload.exemplaires_disponibles ?? payload.total_exemplaires ?? 1;
    const book = await Book.create(payload);
    // journaliser l'activité
    logActivity(req.user?.id, 'Créer livre', { id: book.id, titre: book.titre });
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const b = await Book.findByPk(req.params.id);
    if (!b) return res.status(404).json({ error: 'Livre introuvable' });
    await b.update(req.body);
    if (b.exemplaires_disponibles > b.total_exemplaires) {
      b.exemplaires_disponibles = b.total_exemplaires;
      await b.save();
    }
    logActivity(req.user?.id, 'Modifier livre', { id: b.id, changes: req.body });
    res.json(b);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteBook = async (req, res) => {
  try {
    const b = await Book.findByPk(req.params.id);
    if (!b) return res.status(404).json({ error: 'Livre introuvable' });
    await b.destroy();
    logActivity(req.user?.id, 'Supprimer livre', { id: b.id, titre: b.titre });
    res.json({ message: 'Livre supprimé' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Rechercher des livres par titre, auteur, code, thème ou emplacement
exports.searchBooks = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const type = req.query.type;
    if (!q) return res.json([]);

    const where = {
      [Op.or]: [
        { titre: { [Op.like]: `%${q}%` } },
        { code: { [Op.like]: `%${q}%` } },
        { auteur: { [Op.like]: `%${q}%` } }
      ]
    };

    if (type) {
      where.type_ouvrage = type;
    }

    const books = await Book.findAll({
      where,
      limit: 10
    });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur recherche livres' });
  }
};

const TYPE_OUVRAGE_VALUES = ['livre', 'revue', 'ouvrage de référence', 'document académique', 'memoire', 'périodique'];
const ETAT_VALUES = ['disponible', 'reparation'];

// Import en masse de livres depuis un fichier Excel (upsert par code)
exports.importBooks = async (req, res) => {
  const rows = Array.isArray(req.body.rows) ? req.body.rows : [];
  let created = 0, updated = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i] || {};
    const rowNum = i + 2;
    try {
      const code = (r.code || '').toString().trim();
      const titre = (r.titre || '').toString().trim();
      if (!code || !titre) { errors.push({ row: rowNum, message: 'code et titre requis' }); continue; }

      const payload = {
        code, titre,
        auteur: r.auteur || null,
        editeur: r.editeur || null,
        annee_publication: r.annee_publication ? parseInt(r.annee_publication, 10) : null,
        edition: r.edition || null,
        langue: r.langue || null,
        nombre_pages: r.nombre_pages ? parseInt(r.nombre_pages, 10) : null,
        genre: r.genre || null,
        theme: r.theme || null,
        mots_cles: r.mots_cles || null,
        emplacement: r.emplacement || null,
        resume: r.resume || null
      };
      if (TYPE_OUVRAGE_VALUES.includes(r.type_ouvrage)) payload.type_ouvrage = r.type_ouvrage;
      if (ETAT_VALUES.includes(r.etat)) payload.etat = r.etat;
      if (r.total_exemplaires !== undefined && r.total_exemplaires !== '') {
        payload.total_exemplaires = Math.max(1, parseInt(r.total_exemplaires, 10) || 1);
      }
      if (r.gratuit !== undefined && r.gratuit !== '') {
        payload.gratuit = ['1', 'true', 'oui'].includes(String(r.gratuit).toLowerCase());
      }

      const existing = await Book.findOne({ where: { code } });
      if (existing) {
        await existing.update(payload);
        if (existing.exemplaires_disponibles > existing.total_exemplaires) {
          existing.exemplaires_disponibles = existing.total_exemplaires;
          await existing.save();
        }
        updated++;
      } else {
        payload.total_exemplaires = payload.total_exemplaires || 1;
        payload.exemplaires_disponibles = payload.total_exemplaires;
        await Book.create(payload);
        created++;
      }
    } catch (err) {
      errors.push({ row: rowNum, message: err.message });
    }
  }

  logActivity(req.user?.id, 'Import livres', { created, updated, errors: errors.length });
  res.json({ created, updated, errors });
};