const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(
  helmet({
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'CF-Turnstile-Response'],
  })
);

app.use(express.json({ limit: '10kb' }));

// Trust proxy for correct IP detection behind Render/Vercel
app.set('trust proxy', 1);

// Routes
app.use(routes);

// Global error handler
app.use(errorHandler);

module.exports = app;
