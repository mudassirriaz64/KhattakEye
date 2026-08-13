require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Banner = require('../models/Banner');

// One-off backfill for the new Banner.placement[] field (ERP.md §11).
// Preserves current visible behavior at the moment of deploy:
//   - type "homepage-slider" banners -> placement ["homepage-hero"]
//   - type "promotional" banners      -> placement ["homepage-promo", "shop-page"]
// Other banners keep an empty placement (renders nowhere until an admin assigns one).

const backfillPlacements = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to database to backfill banner placements...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database.');

    const total = await Banner.countDocuments({});

    const hero = await Banner.updateMany(
      { type: 'homepage-slider' },
      { $set: { placement: ['homepage-hero'] } }
    );

    const promo = await Banner.updateMany(
      { type: 'promotional' },
      { $set: { placement: ['homepage-promo', 'shop-page'] } }
    );

    const untouched = await Banner.countDocuments({ placement: { $exists: false } });

    console.log(`📊 Banner collection has ${total} documents total.`);
    console.log(`✅ Updated ${hero.modifiedCount} homepage-slider banner(s) -> placement ["homepage-hero"]`);
    console.log(`✅ Updated ${promo.modifiedCount} promotional banner(s) -> placement ["homepage-promo", "shop-page"]`);
    console.log(`ℹ️  ${untouched} banner(s) have no placement yet (renders nowhere until an admin assigns one).`);

    const samples = await Banner.find().select('title type placement').lean();
    samples.forEach((s) => console.log(`   - ${s.type} | ${s.title || '(untitled)'} | placement: ${JSON.stringify(s.placement || [])}`));
  } catch (error) {
    console.error(`❌ Backfill failed: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
};

backfillPlacements();
