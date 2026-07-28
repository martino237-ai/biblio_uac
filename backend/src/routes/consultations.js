const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/consultationController');

router.use(authenticateToken);

router.get('/', ctrl.getAllConsultations);
router.post('/', ctrl.createConsultation);
router.post('/import', requireRole(['bibliothecaire', 'directeur']), ctrl.importConsultations);
router.post('/:id/end', ctrl.endConsultation);

module.exports = router;
