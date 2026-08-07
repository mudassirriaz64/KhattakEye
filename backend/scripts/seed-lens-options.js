require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const LensOption = require('../models/LensOption');

// NOTE: Eyeglasses coating prices are PLACEHOLDERS pending final pricing review.
// Update these values, then re-run: node backend/scripts/seed-lens-options.js
const LENS_OPTIONS = [
  // --- Sunglasses (mirrors frontend/src/pages/SelectLensesPage.tsx LENS_OPTIONS) ---
  {
    slug: 'basic-tint',
    appliesTo: 'sunglasses',
    name: 'Basic Tint',
    price: 1000,
    description: 'Standard UV protection with classic solid tinting.',
    info: 'Best for casual daily wear. Provides 100% UV protection with clear view contrast.',
    hasStrengthOptions: true,
    strengths: [
      { label: 'Light (35%)', value: 'Light (35%)' },
      { label: 'Medium (50%)', value: 'Medium (50%)' },
      { label: 'Dark (85%)', value: 'Dark (85%)' }
    ],
    hasColorOptions: true,
    colors: [
      { label: 'Solid Black', value: 'Solid Black', hex: '#1f2937' },
      { label: 'Solid Brown', value: 'Solid Brown', hex: '#78350f' },
      { label: 'Solid Green', value: 'Solid Green', hex: '#064e3b' }
    ],
    order: 1
  },
  {
    slug: 'medium-premium-tint',
    appliesTo: 'sunglasses',
    name: 'Medium Premium Tint',
    price: 1800,
    description: 'Extra optical contrast and anti-glare back coating.',
    info: 'Reduces eye strain under bright conditions. Anti-reflective back coatings prevent reflection shadows.',
    hasStrengthOptions: true,
    strengths: [
      { label: 'Medium (50%)', value: 'Medium (50%)' },
      { label: 'Dark (85%)', value: 'Dark (85%)' }
    ],
    hasColorOptions: true,
    colors: [
      { label: 'Solid Black', value: 'Solid Black', hex: '#1f2937' },
      { label: 'Solid Brown', value: 'Solid Brown', hex: '#78350f' },
      { label: 'Solid Green', value: 'Solid Green', hex: '#064e3b' }
    ],
    order: 2
  },
  {
    slug: 'gradient-fashion-tint',
    appliesTo: 'sunglasses',
    name: 'Gradient Fashion Tint',
    price: 2500,
    description: 'Dark top fading to clear bottom. Preferred by drivers.',
    info: 'Fades down elegantly. The darker top blocks overhead sun rays, while the lighter bottom helps you view dashboards clearly.',
    hasStrengthOptions: true,
    strengths: [{ label: 'Standard Gradient', value: 'Standard Gradient' }],
    hasColorOptions: true,
    colors: [
      { label: 'Smoke Gradient', value: 'Smoke Gradient', hex: '#1f2937' },
      { label: 'Amber Gradient', value: 'Amber Gradient', hex: '#78350f' },
      { label: 'Forest Gradient', value: 'Forest Gradient', hex: '#064e3b' }
    ],
    order: 3
  },
  {
    slug: 'polarized-hd',
    appliesTo: 'sunglasses',
    name: 'Polarized HD Anti-Glare',
    price: 3500,
    description: 'Ultimate glare reduction. Blocks reflections from water/road.',
    info: 'Contains vertical polarization filters. Ideal for driving, sports, marine outings. Eliminates blinding reflections.',
    hasStrengthOptions: true,
    strengths: [{ label: 'Dark Polarized (85%)', value: 'Dark Polarized (85%)' }],
    hasColorOptions: true,
    colors: [
      { label: 'HD Polarized Grey', value: 'HD Polarized Grey', hex: '#0f172a' },
      { label: 'HD Polarized Brown', value: 'HD Polarized Brown', hex: '#451a03' }
    ],
    order: 4
  },

  // --- Eyeglasses coatings (placeholder prices — PENDING REVIEW) ---
  // Names/order per Architecture.md §8b item 3 / ERP.md §14
  {
    slug: 'clear-antiglare',
    appliesTo: 'eyeglasses',
    name: 'Clear & Antiglare',
    price: 0,
    description: 'Essential clear lenses with antiglare coating.',
    info: 'Reduces reflections from screens and headlights for clearer vision.',
    hasStrengthOptions: false,
    strengths: [],
    hasColorOptions: false,
    colors: [],
    order: 1
  },
  {
    slug: 'blue-light-filtering',
    appliesTo: 'eyeglasses',
    name: 'Blue Light Filtering',
    price: 1200,
    description: 'Filters harmful blue light from digital screens.',
    info: 'Reduces eye strain, headaches, and sleep disruption during long screen hours.',
    hasStrengthOptions: false,
    strengths: [],
    hasColorOptions: false,
    colors: [],
    order: 2
  },
  {
    slug: 'transitions-photochromic',
    appliesTo: 'eyeglasses',
    name: 'Transitions® & Photochromic',
    price: 2500,
    description: 'Clear indoors, automatically darkens in sunlight.',
    info: 'One pair of glasses for both indoor and outdoor use.',
    hasStrengthOptions: false,
    strengths: [],
    hasColorOptions: false,
    colors: [],
    order: 3
  },
  {
    slug: 'blue-light-transition',
    appliesTo: 'eyeglasses',
    name: 'Blue Light + Transition',
    price: 3000,
    description: 'Blue light filtering combined with light-adaptive lenses.',
    info: 'Day-to-night protection with automatic darkening and screen glare reduction.',
    hasStrengthOptions: false,
    strengths: [],
    hasColorOptions: false,
    colors: [],
    order: 4
  },
  {
    slug: 'sun',
    appliesTo: 'eyeglasses',
    name: 'Sun',
    price: 2000,
    description: 'Darkened tint lenses for bright outdoor conditions.',
    info: 'Full UV protection with a comfortable dark tint for outdoor wear.',
    hasStrengthOptions: false,
    strengths: [],
    hasColorOptions: false,
    colors: [],
    order: 5
  }
];

const seedLensOptions = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to database to seed lens options...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database.');

    let upserted = 0;
    for (const option of LENS_OPTIONS) {
      await LensOption.findOneAndUpdate(
        { slug: option.slug },
        { $set: option },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upserted += 1;
    }

    console.log(`🎉 Seeded/updated ${upserted} lens options.`);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
};

seedLensOptions();
