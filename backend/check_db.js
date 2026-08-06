require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

async function run() {
  await connectDB();
  console.log("Connected to DB.");
  const p = await Product.findById('6a736d4379d8d13bc5ea6592');
  console.log("Specific product by ID:", p);
  mongoose.connection.close();
}

run();
