const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🏁 Starting Auth Verification Tests...');

  // Connect to DB to inspect OTPs and clean up
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB.');

  const testEmail = `tester-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  const testName = 'Test User';
  const testPhone = '03001234567';

  let customerTokenCookie = '';
  let adminTokenCookie = '';

  try {
    // 1. REGISTER
    console.log(`\n➡️ Registering user: ${testEmail}...`);
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      fullName: testName,
      email: testEmail,
      phone: testPhone,
      password: testPassword
    });
    
    console.log('✅ Registration request completed.');
    console.log('Response body user:', regRes.data.user);
    
    // Capture token from cookie
    const setCookie = regRes.headers['set-cookie'];
    if (setCookie && setCookie[0]) {
      customerTokenCookie = setCookie[0].split(';')[0];
      console.log('Captured customer cookie:', customerTokenCookie);
    }

    // 2. FETCH OTP FROM DB
    const dbUser = await mongoose.connection.db.collection('users').findOne({ email: testEmail });
    const otp = dbUser.verificationOtp;
    console.log(`\n🔑 Retrieved OTP from Database: ${otp}`);

    // 3. VERIFY OTP
    console.log('➡️ Verifying OTP...');
    const verifyRes = await axios.post(
      `${BASE_URL}/auth/verify-otp`, 
      { code: otp },
      { headers: { Cookie: customerTokenCookie } }
    );
    console.log('✅ OTP Verification Response:', verifyRes.data);

    // 4. FETCH PROFILE (/me)
    console.log('\n➡️ Requesting current customer profile (/auth/me)...');
    const meRes = await axios.get(
      `${BASE_URL}/auth/me`,
      { headers: { Cookie: customerTokenCookie } }
    );
    console.log('✅ Customer /me response user profile:', meRes.data.user);

    // 5. ADMIN LOGIN
    console.log('\n➡️ Requesting admin login...');
    const adminLogRes = await axios.post(`${BASE_URL}/admin/auth/login`, {
      email: 'admin@khattakeye.com',
      password: 'Admin1234'
    });
    console.log('✅ Admin login completed.');
    console.log('Response body user:', adminLogRes.data.user);

    // Capture admin token from cookie
    const setAdminCookie = adminLogRes.headers['set-cookie'];
    if (setAdminCookie && setAdminCookie[0]) {
      adminTokenCookie = setAdminCookie[0].split(';')[0];
      console.log('Captured admin cookie:', adminTokenCookie);
    }

    // 6. ADMIN FETCH PROFILE (/admin/auth/me)
    console.log('\n➡️ Requesting current admin profile (/admin/auth/me)...');
    const adminMeRes = await axios.get(
      `${BASE_URL}/admin/auth/me`,
      { headers: { Cookie: adminTokenCookie } }
    );
    console.log('✅ Admin /me response user profile:', adminMeRes.data.user);

    // 7. VERIFY CUSTOMER CANNOT ACCESS ADMIN PROFILE
    console.log('\n➡️ Verifying customer JWT cannot access admin profile...');
    try {
      await axios.get(
        `${BASE_URL}/admin/auth/me`,
        { headers: { Cookie: customerTokenCookie } }
      );
      console.log('❌ Failure: Customer was allowed access to admin route!');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log('✅ Success: Customer JWT rejected with 401 on admin endpoint.');
      } else {
        console.log(`⚠️ Unexpected error on admin endpoint: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.response ? error.response.data : error.message);
  } finally {
    // Clean up test user
    console.log('\n🧹 Cleaning up test user...');
    await mongoose.connection.db.collection('users').deleteOne({ email: testEmail });
    console.log('✅ Test user deleted.');
    
    await mongoose.disconnect();
    console.log('🔌 DB connection closed.');
    console.log('🏁 Verification complete.');
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
