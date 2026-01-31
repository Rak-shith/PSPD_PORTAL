const express = require('express');
const router = express.Router();

const controller = require('./holidays.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');


router.get('/', auth, controller.getByUnit);
router.post('/', auth, role('HR_ADMIN'), controller.create);
router.get('/all-holidays', auth, controller.getAll);

module.exports = router;
