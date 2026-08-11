const mongoose = require('mongoose');

// Use global cache to survive container re-uses and hot-reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1. Return existing active connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If no connection attempt is in flight, initiate one
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((m) => {
      // Register discriminators eagerly once connected
      require('../models/Glasses');
      require('../models/Lenses');
      console.log(`MongoDB Connected: ${m.connection.host}`);
      return m;
    });
  }

  // 3. Await the in-flight connection promise (prevents readyState === 2 race conditions)
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset so next request can retry
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;