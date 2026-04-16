const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const ctrl = require('../controllers/consultationController');

router.use(authenticateToken);

router.get('/', ctrl.getAllConsultations);
router.post('/', ctrl.createConsultation);
router.post('/:id/end', ctrl.endConsultation);

module.exports = router;
