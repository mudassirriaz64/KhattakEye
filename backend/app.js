require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();




app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/public/orders', require('./routes/orders.routes'));
app.use('/api/admin/auth', require('./routes/admin/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Global Error Handler
app.use(errorHandler);

module.exports = app;
