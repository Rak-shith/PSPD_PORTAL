const express = require('express');
const router = express.Router();

const controller = require('./accessRequests.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');

// Employee
router.post('/', auth, controller.createRequest);

// IT Admin
router.get('/', auth, role('IT_ADMIN'), controller.getAllRequests);
router.put('/:id', auth, role('IT_ADMIN'), controller.updateStatus);

module.exports = router;
