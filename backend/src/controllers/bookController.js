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