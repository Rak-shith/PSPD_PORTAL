const express = require('express');
const router = express.Router();

const controller = require('./hrUpdates.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');
const upload = require('../../utils/hrUpload');

// Public (authenticated)
router.get('/', auth, controller.getAll);
router.get('/latest', auth, controller.getLatest);

// HR Admin
router.post(
  '/',
  auth,
  role('HR_ADMIN'),
  upload.array('attachments', 5),
  controller.create
);

router.delete('/:id', auth, role('HR_ADMIN'), controller.remove);

module.exports = router;
