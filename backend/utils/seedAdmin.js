require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');
const { hashPassword } = require('./password');

const seedAdmin = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to database to seed admin...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database.');

    const email = 'admin@khattakeye.com';
    const existingAdmin = await AdminUser.findOne({ email });

    if (existingAdmin) {
      console.log(`ℹ️ Admin user with email "${email}" already exists.`);
    } else {
      console.log(`🔄 Hashing password for admin...`);
      const passwordHash = await hashPassword('Admin1234');

      const adminUser = new AdminUser({
        name: 'Admin Khattak',
        email,
        passwordHash,
        role: 'super-admin',
        isActive: true
      });

      await adminUser.save();
      console.log(`🎉 Super-admin created successfully!`);
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: Admin1234`);
    }
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
};

seedAdmin();
