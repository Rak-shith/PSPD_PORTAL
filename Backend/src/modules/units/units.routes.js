const express = require('express');
const router = express.Router();
const controller = require('./units.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');
const { handleValidationErrors } = require('../../middleware/validation.middleware');
const { unitValidation } = require('../../middleware/validation.rules');

// All authenticated users
router.get('/', auth, controller.getAll);

// HR Admin only
router.post('/', auth, role('HR_ADMIN'), unitValidation, handleValidationErrors, controller.create);
router.put('/:id', auth, role('HR_ADMIN'), unitValidation, handleValidationErrors, controller.update);
router.delete('/:id', auth, role('HR_ADMIN'), controller.remove);
router.patch('/:id/status', auth, role('HR_ADMIN'), controller.toggleStatus);

module.exports = router;
