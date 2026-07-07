const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

try {
  const { requireAuth } = require('../middleware/authMiddleware');

  router.post('/login', userController.login);
  router.post('/logout', userController.logout);
  router.post('/refresh-token', requireAuth, userController.refreshToken);
  router.get('/me', requireAuth, userController.getProfile);
} catch (error) {
  console.warn('Auth middleware not loaded:', error.message);
}

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
