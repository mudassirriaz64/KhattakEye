require('dotenv').config();
const mongoose = require('mongoose');
const SiteSettings = require('./models/SiteSettings');
require('./config/db')().then(async () => {
  await SiteSettings.updateOne({ _id: 'site-settings' }, { '$set': { 'policies.returnWindowDays': 14, 'policies.warrantyYears': 1 } });
  console.log('SiteSettings updated');
  process.exit(0);
});
