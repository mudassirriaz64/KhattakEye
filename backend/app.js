require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();




app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(',').forEach(o => allowedOrigins.push(o.trim()));
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(allowed => allowed.replace(/\/$/, '') === cleanedOrigin);
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'khattak_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/api/coupons', require('./routes/coupons.routes'));
app.use('/api/promotions', require('./routes/promotions.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/uploads', require('./routes/uploads.routes'));
app.use('/api/admin/auth', require('./routes/admin/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Global Error Handler
app.use(errorHandler);

module.exports = app;
