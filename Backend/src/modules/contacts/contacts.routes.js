const express = require('express');
const router = express.Router();

const controller = require('./contacts.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');
const { handleValidationErrors } = require('../../middleware/validation.middleware');
const { contactValidation } = require('../../middleware/validation.rules');

// Authenticated users
router.get('/', auth, controller.getAll);

// IT Admin only
router.post('/', auth, role('IT_ADMIN'), contactValidation, handleValidationErrors, controller.create);
router.put('/:id', auth, role('IT_ADMIN'), contactValidation, handleValidationErrors, controller.update);
router.delete('/:id', auth, role('IT_ADMIN'), controller.remove);
router.patch('/:id/status', auth, role('IT_ADMIN'), controller.toggleStatus);

module.exports = router;
