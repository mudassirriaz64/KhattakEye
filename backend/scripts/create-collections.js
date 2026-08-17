require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');

async function createCollections() {
  try {
    await connectDB();
    console.log("Connected to DB, creating collections...");

    const modelsDir = path.join(__dirname, '../models');
    const modelFiles = fs.readdirSync(modelsDir).filter(file => file.endsWith('.js'));

    for (const file of modelFiles) {
      const modelName = file.replace('.js', '');
      try {
        const Model = require(`../models/${file}`);
        
        // Mongoose 6+ has a createCollection method on models
        await Model.createCollection();
        console.log(`✅ Collection created for model: ${modelName} (${Model.collection.name})`);
      } catch (err) {
        if (err.code === 48) {
          // Error code 48 is "NamespaceExists", meaning the collection already exists
          console.log(`⚠️ Collection already exists for model: ${modelName}`);
        } else {
          console.error(`❌ Error creating collection for ${modelName}:`, err.message);
        }
      }
    }

    console.log("All collections processed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Script error:", error);
    process.exit(1);
  }
}

createCollections();
