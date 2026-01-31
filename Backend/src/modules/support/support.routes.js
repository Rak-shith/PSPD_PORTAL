const express = require('express');
const router = express.Router();

const controller = require('./support.controller');
const auth = require('../../middleware/auth.middleware');

// Authenticated users
router.get('/', auth, controller.getAll);

module.exports = router;
