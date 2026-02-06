const express = require('express');
const router = express.Router();

const controller = require('./hrUpdates.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');
const upload = require('../../utils/hrUpload');
const { handleValidationErrors } = require('../../middleware/validation.middleware');
const { hrUpdateValidation } = require('../../middleware/validation.rules');

// Public (authenticated)
router.get('/', auth, controller.getAll);
router.get('/latest', auth, controller.getLatest);

// HR Admin
router.post(
  '/',
  auth,
  role('HR_ADMIN'),
  upload.array('attachments', 5),
  hrUpdateValidation,
  handleValidationErrors,
  controller.create
);

router.put(
  '/:id',
  auth,
  role('HR_ADMIN'),
  upload.array('attachments', 5),
  hrUpdateValidation,
  handleValidationErrors,
  controller.update
);

router.delete('/:id', auth, role('HR_ADMIN'), controller.remove);

module.exports = router;
