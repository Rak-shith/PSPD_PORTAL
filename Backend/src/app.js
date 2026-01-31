const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api', rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 1000
// }));
// app.use(cors({
//   origin: ['https://portal.itc.com'],
//   credentials: true
// }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

const authMiddleware = require('./middleware/auth.middleware');
const errorMiddleware = require('./middleware/error.middleware')

const authRoutes = require('./modules/auth/auth.routes');
const categoryRoutes = require('./modules/categories/categories.routes');
const applicationRoutes = require('./modules/applications/applications.routes');
const favoriteRoutes = require('./modules/favorites/favorites.routes');
const accessRequestRoutes = require('./modules/access-requests/accessRequests.routes');
const contactRoutes = require('./modules/contacts/contacts.routes');
const supportRoutes = require('./modules/support/support.routes');
const unitRoutes = require('./modules/units/units.routes');
const holidayRoutes = require('./modules/holidays/holidays.routes');

app.use('/api/holidays', holidayRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/access-requests', accessRequestRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use(authMiddleware);
app.use(errorMiddleware);

module.exports = app;
