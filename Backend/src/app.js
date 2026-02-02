const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL, // Updated to match your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

const authMiddleware = require('./middleware/auth.middleware');
const errorMiddleware = require('./middleware/error.middleware')
const apiRoutes = require('./routes');

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// API Routes
app.use('/api', apiRoutes);

// Middleware Handling
app.use(authMiddleware);
app.use(errorMiddleware);

module.exports = app;
