const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/loanController');

router.use(authenticateToken);

router.get('/', ctrl.getAllLoans);
router.post('/', ctrl.createLoan);
router.post('/import', requireRole(['bibliothecaire', 'directeur']), ctrl.importLoans);
router.post('/:id/return', ctrl.returnLoan);
router.post('/:id/renew', ctrl.renewLoan);

module.exports = router;
