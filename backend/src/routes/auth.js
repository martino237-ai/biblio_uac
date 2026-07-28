const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post('/login', authCtrl.login);
// general user registration (admin/bibliothecaire) - still protected by role check if you add it later
router.post('/register', authenticateToken, requireRole(['directeur']), authCtrl.register);
// new endpoint for readers to self-register without being authenticated
router.post('/register-reader', authCtrl.registerReader);

// only staff may list users; lector should not see list of accounts
router.get('/users', authenticateToken, requireRole(['bibliothecaire','directeur']), authCtrl.getAllUsers);
// only directeur can bulk-import user accounts (contains password handling)
router.post('/users/import', authenticateToken, requireRole(['directeur']), authCtrl.importUsers);
// only directeur can delete other users
router.delete('/users/:id', authenticateToken, requireRole(['directeur']), authCtrl.deleteUser);
// only directeur can update other users
router.put('/users/:id', authenticateToken, requireRole(['directeur']), authCtrl.updateUser);
// users can update their own profile
router.put('/profile', authenticateToken, authCtrl.updateProfile);

module.exports = router;
