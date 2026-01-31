const express = require('express');
const router = express.Router();
const controller = require('./categories.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');

router.get('/', auth, controller.getAll);
router.post('/', auth, role('IT_ADMIN'), controller.create);

module.exports = router;
