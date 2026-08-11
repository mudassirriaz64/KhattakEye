const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    // Register discriminators eagerly
    require('../models/Glasses');
    require('../models/Lenses');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Always exit on boot-time connection failure — a disconnected server is not
    // usable in any environment. Let the process supervisor (nodemon / Vercel)
    // restart it rather than silently serving requests with no DB.
    process.exit(1);
  }
};

module.exports = connectDB;
