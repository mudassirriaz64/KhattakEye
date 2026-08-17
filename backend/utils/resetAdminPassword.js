require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');
const { hashPassword } = require('./password');

const resetAdminPassword = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database.');

    const email = 'admin@khattakeye.com';
    const newPassword = 'Admin1234';

    const existingAdmin = await AdminUser.findOne({ email });

    if (!existingAdmin) {
      console.log(`❌ Admin user with email "${email}" not found. Creating new one...`);
      const passwordHash = await hashPassword(newPassword);
      const adminUser = new AdminUser({
        name: 'Admin Khattak',
        email,
        passwordHash,
        role: 'super-admin',
        isActive: true
      });
      await adminUser.save();
      console.log(`🎉 New super-admin created!`);
    } else {
      console.log(`🔄 Updating password for "${email}"...`);
      const passwordHash = await hashPassword(newPassword);
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log(`✅ Password reset successful!`);
    }

    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${newPassword}`);
  } catch (error) {
    console.error(`❌ Reset failed: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
};

resetAdminPassword();
