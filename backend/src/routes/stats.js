const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const stats = require('../controllers/statsController');

router.use(authenticateToken);

// =======================
// ROUTES EXISTANTES
// =======================
router.get('/summary', stats.summary);
router.get('/top-books', stats.topBooks);
router.get('/top-readers', stats.topReaders);
router.get('/faculties', stats.faculties);
router.get('/trends', stats.trends);

// =======================
// 🔥 NOUVELLES ROUTES AJOUTÉES
// =======================
// 🔥 AJOUT DES ROUTES MANQUANTES (TRÈS IMPORTANT)
router.get('/hourly-consults', stats.hourlyConsults);
router.get('/monthly-consults', stats.monthlyConsults);
// Stats par filière et faculté
router.get('/filieres-facultes', stats.getStatsByFiliereFaculte);

// Stats générales (tableau de bord avancé)
router.get('/general', stats.getGeneralStats);

// Stats pour export (Excel / CSV / PDF)
router.get('/export', stats.getExportStats);

// Stats par période (graphiques temporels)
router.get('/period', stats.getStatsByPeriod);

module.exports = router;
