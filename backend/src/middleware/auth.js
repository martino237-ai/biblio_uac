const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const authenticateToken = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// middleware for simple role checks
const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authentification requise' });
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Accès interdit' });
  }
  next();
};

module.exports = { authenticateToken, requireRole };
