const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, favoriteController.getMyFavorites);
router.post('/:productId', authMiddleware, favoriteController.toggleFavorite);

module.exports = router;
