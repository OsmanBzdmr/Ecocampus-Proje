const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerValidation, loginValidation, deleteAccountValidation } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authLimiter, registerValidation, authController.register);
router.post('/login', authLimiter, loginValidation, authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.delete('/me', authLimiter, authMiddleware, deleteAccountValidation, authController.deleteAccount);

module.exports = router;