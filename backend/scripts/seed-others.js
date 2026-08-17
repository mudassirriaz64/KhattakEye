require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const SiteSettings = require('../models/SiteSettings');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const connectDB = require('../config/db');

async function seed() {
  try {
    await connectDB();
    console.log("Connected to DB, starting seed...");

    // 1. AdminUser
    const adminExists = await AdminUser.findOne({ email: 'admin@khattakeye.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await AdminUser.create({
        name: 'Super Admin',
        email: 'admin@khattakeye.com',
        passwordHash: hashedPassword,
        role: 'super-admin'
      });
      console.log("Seeded Super Admin user (admin@khattakeye.com / admin123)");
    } else {
      console.log("Admin user already exists.");
    }

    // 2. SiteSettings
    const settingsCount = await SiteSettings.countDocuments();
    if (settingsCount === 0) {
      await SiteSettings.create({
        _id: "site-settings",
        contact: {
          phone: "+92 300 1234567",
          email: "info@khattakeye.com"
        }
      });
      console.log("Seeded default SiteSettings.");
    } else {
      console.log("SiteSettings already seeded.");
    }

    // 3. Category
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      const defaultCategories = [
        { name: "Men's Glasses", slug: "mens-glasses", productKind: "glasses", type: "category" },
        { name: "Women's Glasses", slug: "womens-glasses", productKind: "glasses", type: "category" },
        { name: "Kids' Glasses", slug: "kids-glasses", productKind: "glasses", type: "category" },
        { name: "Contact Lenses", slug: "contact-lenses", productKind: "lenses", type: "category" }
      ];
      await Category.insertMany(defaultCategories);
      console.log("Seeded default Categories.");
    } else {
      console.log("Categories already seeded.");
    }

    // 4. Brand
    const brandsCount = await Brand.countDocuments();
    if (brandsCount === 0) {
      const defaultBrands = [
        { name: "Ray-Ban", slug: "ray-ban" },
        { name: "Oakley", slug: "oakley" },
        { name: "Gucci", slug: "gucci" },
        { name: "Acuvue", slug: "acuvue" }
      ];
      await Brand.insertMany(defaultBrands);
      console.log("Seeded default Brands.");
    } else {
      console.log("Brands already seeded.");
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
