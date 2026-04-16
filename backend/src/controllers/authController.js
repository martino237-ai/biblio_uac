const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { logActivity } = require('../utils/activityLogger');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('🔍 Login attempt:', { username, password });
    
    if (!username) return res.status(400).json({ message: 'username requis' });

    const user = await User.findOne({ where: { username } });
    console.log('👤 User found:', user ? { id: user.id, username: user.username, role: user.role } : 'NOT FOUND');
    
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });

    if (!password) return res.status(400).json({ message: 'Mot de passe requis' });

    const ok = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password match:', ok);
    
    if (!ok) return res.status(401).json({ message: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, nom: user.nom } });

    logActivity(user.id, 'Connexion', { username: user.username });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, nom, role } = req.body;
    
    if (!username) return res.status(400).json({ message: 'Nom d\'utilisateur requis' });
    if (!password) return res.status(400).json({ message: 'Mot de passe requis' });
    
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ message: 'Cet utilisateur existe déjà' });

    // allow lecteur role as well even though it wasn't supported before
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password_hash,
      nom: nom || username,
      role: role || 'bibliothecaire'
    });

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès', 
      user: { id: user.id, username: user.username, role: user.role, nom: user.nom } 
    });
    logActivity(req.user?.id || null, 'Création utilisateur', { username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création' });
  }
};

// new endpoint for reader self-registration (two‑stage form in the frontend can send all data here)
exports.registerReader = async (req, res) => {
  try {
    const {
      readerId,
      username,
      password,
      nom,
      prenom,
      type,
      faculte,
      filiere,
      niveau,
      telephone,
      matricule,
      email,
      date_inscription
    } = req.body;

    if (!username) return res.status(400).json({ message: 'Email / nom d\'utilisateur requis' });
    if (!password) return res.status(400).json({ message: 'Mot de passe requis' });
    if (!nom || !prenom) return res.status(400).json({ message: 'Nom et prénom requis' });

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Un compte avec cet email existe déjà' });

    let reader;
    if (readerId) {
      // update existing record
      reader = await require('../models').Reader.findByPk(readerId);
      if (!reader) return res.status(404).json({ message: 'Lecteur introuvable' });
      await reader.update({
        nom,
        prenom,
        type: type || reader.type,
        faculte: faculte || reader.faculte,
        filiere: filiere || reader.filiere,
        niveau: niveau || reader.niveau,
        telephone: telephone || reader.telephone,
        matricule: matricule || reader.matricule,
        email: email || username,
        date_inscription: date_inscription || reader.date_inscription
      });
    } else {
      reader = await require('../models').Reader.create({
        nom,
        prenom,
        type: type || 'etudiant',
        faculte: faculte || null,
        filiere: filiere || null,
        niveau: niveau || null,
        telephone: telephone || null,
        matricule: matricule || null,
        email: email || username,
        date_inscription: date_inscription || new Date()
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password_hash,
      nom: `${nom} ${prenom}`,
      role: 'lecteur'
    });

    // generate token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: { id: user.id, username: user.username, role: user.role, nom: user.nom },
      reader
    });
    logActivity(user.id, 'Inscription lecteur', { readerId: reader.id, username });
  } catch (err) {
    console.error('❌ registerReader error:', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription du lecteur' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] },
      order: [['id', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    console.error('getAllUsers error:', err.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    await user.destroy();
    logActivity(req.user?.id, 'Suppression utilisateur', { id });
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
