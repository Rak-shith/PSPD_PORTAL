const express = require('express');
const router = express.Router();

const controller = require('./applications.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');

// Public (Authenticated)
router.get('/', auth, controller.getAll);

// IT Admin only
router.post('/', auth, role('IT_ADMIN'), controller.create);
router.put('/:id', auth, role('IT_ADMIN'), controller.update);
router.delete('/:id', auth, role('IT_ADMIN'), controller.remove);

module.exports = router;
