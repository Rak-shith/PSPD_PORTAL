const express = require('express');
const router = express.Router();

// Import all module routes
const authRoutes = require('../modules/auth/auth.routes');
const categoryRoutes = require('../modules/categories/categories.routes');
const applicationRoutes = require('../modules/applications/applications.routes');
const favoriteRoutes = require('../modules/favorites/favorites.routes');
const accessRequestRoutes = require('../modules/access-requests/accessRequests.routes');
const contactRoutes = require('../modules/contacts/contacts.routes');
const supportRoutes = require('../modules/support/support.routes');
const unitRoutes = require('../modules/units/units.routes');
const holidayRoutes = require('../modules/holidays/holidays.routes');
const hrUpdateRoutes = require('../modules/hr-updates/hrUpdates.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/applications', applicationRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/access-requests', accessRequestRoutes);
router.use('/contacts', contactRoutes);
router.use('/support', supportRoutes);
router.use('/units', unitRoutes);
router.use('/holidays', holidayRoutes);
router.use('/hr-updates', hrUpdateRoutes);

module.exports = router;
