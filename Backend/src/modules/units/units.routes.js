const express = require('express');
const router = express.Router();
const controller = require('./units.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/', auth, controller.getAll);

module.exports = router;
