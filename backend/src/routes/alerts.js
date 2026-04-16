const express = require('express');
const router = express.Router();
const alertCtrl = require('../controllers/alertController');
const { authenticateToken } = require('../middleware/auth');

// toutes les routes nécessitent un utilisateur authentifié
router.use(authenticateToken);

router.get('/stock', alertCtrl.stockEmpty);
router.get('/loans', alertCtrl.loansOverdue);
router.get('/consultations', alertCtrl.consultsOverdue);

module.exports = router;
