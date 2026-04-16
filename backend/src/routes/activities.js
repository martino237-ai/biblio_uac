const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, activityController.getActivities);
router.post('/', authenticateToken, activityController.logActivity);
router.delete('/:id', authenticateToken, activityController.deleteActivity);

module.exports = router;
