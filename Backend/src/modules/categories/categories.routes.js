const express = require('express');
const router = express.Router();
const controller = require('./categories.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');
const { handleValidationErrors } = require('../../middleware/validation.middleware');
const { categoryValidation } = require('../../middleware/validation.rules');

router.get('/', auth, controller.getAll);
router.post('/', auth, role('HR_ADMIN'), categoryValidation, handleValidationErrors, controller.create);
router.put('/:id', auth, role('HR_ADMIN'), categoryValidation, handleValidationErrors, controller.update);
router.delete('/:id', auth, role('HR_ADMIN'), controller.remove);
router.patch('/:id/status', auth, role('HR_ADMIN'), controller.toggleStatus);

module.exports = router;
