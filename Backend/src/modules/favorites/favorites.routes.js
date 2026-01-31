const express = require('express');
const router = express.Router();

const controller = require('./favorites.controller');
const auth = require('../../middleware/auth.middleware');

// All routes require login
router.get('/', auth, controller.getMyFavorites);
router.post('/:appId', auth, controller.addFavorite);
router.delete('/:appId', auth, controller.removeFavorite);

module.exports = router;
