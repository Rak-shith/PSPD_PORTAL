const express = require('express');
const router = express.Router();

const controller = require('./holidays.controller');
const auth = require('../../middleware/auth.middleware');
const role = require('../../middleware/role.middleware');


router.get('/', auth, controller.getByUnit);
router.post('/', auth, role('HR_ADMIN'), controller.create);
router.put('/:id', auth, role('HR_ADMIN'), controller.update);
router.delete('/:id', auth, role('HR_ADMIN'), controller.remove);
router.get('/all-holidays', auth, controller.getAll);
router.get('/:id/units', auth, controller.getHolidayUnits);

module.exports = router;
