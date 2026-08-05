require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const publicRoutes = require('./routes/public.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Trust proxy for rate limiting behind reverse proxies (e.g. Render/Railway)
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter.authLimiter);

// Health Check Route
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'ok',
    db: isConnected ? 'connected' : 'disconnected'
  });
});

// Mount Routes
app.use('/api', require('./routes/public.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/public/orders', require('./routes/orders.routes'));
app.use('/api/admin/auth', require('./routes/admin/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
