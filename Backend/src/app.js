const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { sanitizeInput } = require('./middleware/validation.middleware');

const app = express();

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(cookieParser());

// Global input sanitization
app.use(sanitizeInput);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
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
