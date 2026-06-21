const { Op } = require("sequelize");
const { Reader, Loan, Consultation, Book, User } = require("../models");
const { logActivity } = require('../utils/activityLogger');

// Liste des lecteurs (avec recherche facultative)
exports.getAllReaders = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const where = q
      ? {
          [Op.or]: [
            { nom: { [Op.like]: `%${q}%` } },
            { prenom: { [Op.like]: `%${q}%` } },
            { matricule: { [Op.like]: `%${q}%` } },
            { faculte: { [Op.like]: `%${q}%` } },
            { filiere: { [Op.like]: `%${q}%` } },
            { niveau: { [Op.like]: `%${q}%` } },
            { email: { [Op.like]: `%${q}%` } },
            { telephone: { [Op.like]: `%${q}%` } }
          ]
        }
      : {};

    const readers = await Reader.findAll({ where });
    res.json(readers);
  } catch (err) {
    console.error("❌ Erreur getAllReaders:", err);
    res.status(500).json({ error: "Impossible de charger les lecteurs" });
  }
};

// Récupérer la fiche lecteur liée à l'utilisateur connecté
exports.getCurrentReader = async (req, res) => {
  try {
    const username = req.user?.username;
    if (!username) return res.status(401).json({ error: 'Authentification requise' });

    const user = req.user?.id ? await User.findByPk(req.user.id) : null;
    const identifiers = [
      username,
      user?.username,
      user?.email
    ].filter(Boolean);

    let reader = await Reader.findOne({
      where: {
        [Op.or]: [
          { email: { [Op.in]: identifiers } },
          { matricule: { [Op.in]: identifiers } }
        ]
      }
    });

    if (!reader && user?.nom) {
      const [nom, ...prenomParts] = user.nom.trim().split(/\s+/);
      const prenom = prenomParts.join(' ');
      if (nom && prenom) {
        reader = await Reader.findOne({ where: { nom, prenom } });
      }
    }
    if (!reader) {
      return res.status(404).json({ error: 'Aucun lecteur associé à cet utilisateur' });
    }

    res.json(reader);
  } catch (err) {
    console.error('❌ Erreur getCurrentReader:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un lecteur par ID
exports.getReaderById = async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) return res.status(404).json({ error: "Lecteur introuvable" });
    res.json(reader);
  } catch (err) {
    console.error("❌ Erreur getReaderById:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getReaderLoans = async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) return res.status(404).json({ error: "Lecteur introuvable" });

    const loans = await Loan.findAll({
      where: { lecteur_id: req.params.id },
      include: [{ model: Book, as: 'Book' }],
      order: [['date_emprunt', 'DESC']]
    });

    res.json(loans);
  } catch (err) {
    console.error("❌ Erreur getReaderLoans:", err);
    res.status(500).json({ error: "Impossible de charger les emprunts du lecteur" });
  }
};

exports.getReaderConsultations = async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) return res.status(404).json({ error: "Lecteur introuvable" });

    const consultations = await Consultation.findAll({
      where: { lecteur_id: req.params.id },
      include: [{ model: Book, as: 'Book' }],
      order: [['heure_debut', 'DESC']]
    });

    res.json(consultations);
  } catch (err) {
    console.error("❌ Erreur getReaderConsultations:", err);
    res.status(500).json({ error: "Impossible de charger les consultations du lecteur" });
  }
};

// Créer un lecteur
exports.createReader = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.type !== 'etudiant') {
      payload.matricule = null;
      payload.faculte = null;
      payload.filiere = null;
      payload.niveau = null;
    } else {
      // Validation pour les étudiants
      if (!payload.matricule || !payload.faculte || !payload.filiere || !payload.niveau) {
        return res.status(400).json({ error: 'Les champs matricule, filière, niveau et faculté sont requis pour les étudiants' });
      }
    }

    const reader = await Reader.create(payload);
    logActivity(req.user?.id, 'Créer lecteur', { id: reader.id, nom: reader.nom });
    res.status(201).json(reader);
  } catch (err) {
    console.error('❌ Erreur createReader:', err);
    res.status(500).json({ error: err.message });
  }
};


// Mettre à jour un lecteur
exports.updateReader = async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) return res.status(404).json({ error: "Lecteur introuvable" });

    const payload = req.body;

    if (payload.type === "etudiant") {
      if (!payload.matricule || !payload.filiere || !payload.niveau) {
        return res.status(400).json({
          error:
            "Pour un étudiant : matricule, filière et niveau sont obligatoires"
        });
      }
    } else {
      payload.matricule = null;
      payload.filiere = null;
      payload.niveau = null;
    }

    await reader.update(payload);
    logActivity(req.user?.id, 'Modifier lecteur', { id: reader.id, changes: payload });
    res.json(reader);
  } catch (err) {
    console.error("❌ Erreur updateReader:", err);
    res.status(500).json({ error: "Impossible de mettre à jour le lecteur" });
  }
};

// Supprimer un lecteur
exports.deleteReader = async (req, res) => {
  try {
    const reader = await Reader.findByPk(req.params.id);
    if (!reader) return res.status(404).json({ error: "Lecteur introuvable" });
    await reader.destroy();
    logActivity(req.user?.id, 'Supprimer lecteur', { id: reader.id, nom: reader.nom });
    res.json({ message: "Lecteur supprimé avec succès" });
  } catch (err) {
    console.error("❌ Erreur deleteReader:", err);
    res.status(500).json({ error: "Impossible de supprimer le lecteur" });
  }
};

// Rechercher des livres par titre, auteur, code, thème ou emplacement
exports.searchReaders = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    
    const readers = await Reader.findAll({
      where: {
        [Op.or]: [
          { nom: { [Op.like]: `%${q}%` } },
          { prenom: { [Op.like]: `%${q}%` } },
          { matricule: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: 10
    });
    res.json(readers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur recherche lecteurs' });
  }
};
