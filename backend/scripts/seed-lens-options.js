require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const LensOption = require('../models/LensOption');

// Drops and reseeds the LensOption collection with the confirmed data from ERP.md §14
// (sunglasses tints unchanged; eyeglasses moved to collections[]/brands[]/lensTypes[]).

// The 4 tints belong to Sun, so they live in the "Common (both)" column like Sun
// itself. Sun delegates to common; the tints are its re-used leaf options.
const COMMON_TINT_OPTIONS = [
  {
    slug: 'basic-tint',
    appliesTo: 'common',
    name: 'Basic Tint',
    price: 1000,
    description: 'Standard UV protection with classic solid tinting.',
    info: 'Best for casual daily wear. Provides 100% UV protection with clear view contrast.',
    hasStrengthOptions: true,
    strengths: [
      { label: 'Light (35%)', value: 'light' },
      { label: 'Medium (50%)', value: 'medium' },
      { label: 'Dark (85%)', value: 'dark' }
    ],
    hasColorOptions: true,
    colors: [
      { label: 'Solid Black', value: 'solid-black', hex: '#1f2937' },
      { label: 'Solid Brown', value: 'solid-brown', hex: '#78350f' },
      { label: 'Solid Green', value: 'solid-green', hex: '#064e3b' }
    ],
    order: 0
  },
  {
    slug: 'medium-premium-tint',
    appliesTo: 'common',
    name: 'Medium Premium Tint',
    price: 1800,
    description: 'Extra optical contrast and anti-glare back coating.',
    info: 'Reduces eye strain under bright conditions. Anti-reflective back coatings prevent reflection shadows.',
    hasStrengthOptions: true,
    strengths: [
      { label: 'Medium (50%)', value: 'medium' },
      { label: 'Dark (85%)', value: 'dark' }
    ],
    hasColorOptions: true,
    colors: [
      { label: 'Solid Black', value: 'solid-black', hex: '#1f2937' },
      { label: 'Solid Brown', value: 'solid-brown', hex: '#78350f' },
      { label: 'Solid Green', value: 'solid-green', hex: '#064e3b' }
    ],
    order: 1
  },
  {
    slug: 'gradient-fashion-tint',
    appliesTo: 'common',
    name: 'Gradient Fashion Tint',
    price: 2500,
    description: 'Dark top fading to clear bottom. Preferred by drivers.',
    info: 'Fades down elegantly. The darker top blocks overhead sun rays, while the lighter bottom helps you view dashboards clearly.',
    hasStrengthOptions: true,
    strengths: [
      { label: 'Standard Gradient', value: 'standard-gradient' }
    ],
    hasColorOptions: true,
    colors: [
      { label: 'Smoke Gradient', value: 'smoke-gradient', hex: '#1f2937' },
      { label: 'Amber Gradient', value: 'amber-gradient', hex: '#78350f' },
      { label: 'Forest Gradient', value: 'forest-gradient', hex: '#064e3b' }
    ],
    order: 2
  },
  {
    slug: 'polarized-hd',
    appliesTo: 'common',
    name: 'Polarized HD Anti-Glare',
    price: 3500,
    description: 'Ultimate glare reduction. Blocks reflections from water/road.',
    info: 'Contains vertical polarization filters. Ideal for driving, sports, marine outings. Eliminates blinding reflections.',
    hasStrengthOptions: true,
    strengths: [
      { label: 'Dark Polarized (85%)', value: 'dark-polarized' }
    ],
    hasColorOptions: true,
    colors: [
      { label: 'HD Polarized Grey', value: 'hd-polarized-grey', hex: '#0f172a' },
      { label: 'HD Polarized Brown', value: 'hd-polarized-brown', hex: '#451a03' }
    ],
    order: 3
  }
];

const EYEGLASSES_OPTIONS = [
  {
    slug: 'distance-vision',
    appliesTo: 'eyeglasses',
    name: 'Distance Vision',
    description: 'Essential clear lenses with antiglare coating.',
    info: 'Reduces reflections from screens and headlights for clearer vision.',
    collections: [
      {
        slug: 'essential',
        name: 'Essential',
        lensTypes: [
          { slug: 'standard-white', name: 'Standard White Lens', price: 600, description: 'Standard white plastic lenses for normal use.' },
          { slug: 'basic-antiglare', name: 'Basic Anti Glare Lens', price: 1200, description: 'Lenses with UV-protective, anti-reflective coatings for everyday use.' },
          { slug: 'medium-antiglare', name: 'Medium Anti Glare Lens', price: 2500, description: 'Quality 1.56 index lenses with UV-protective, anti-scratch, anti-reflective coatings.' },
          { slug: 'premium-antiglare', name: 'Premium Anti Glare Lens', price: 4000, description: 'Our advanced lens with enhanced clarity, UV-protective, anti-scratch and premium anti-reflective coatings.' },
          { slug: 'thin-antiglare-167', name: '1.67 Index Thin Antiglare Lens', price: 9000, description: '1.67 index thin lens for prescription above 4.00 numbers having all the premium features.' }
        ]
      },
      {
        slug: 'comfort',
        name: 'Comfort',
        lensTypes: [
          { slug: 'hard-coat', name: 'Hard Coat', price: 1500, description: 'Hard-coated lenses with scratch-resistant protection for everyday durability.' },
          { slug: 'multicoat', name: 'Multicoat', price: 2500, description: 'Multicoated lenses with anti-reflective layers for reduced glare and clearer vision.' },
          { slug: 'blue-cut-green', name: 'Blue Cut Green', price: 2500, description: 'Blue light filtering lenses with a subtle green reflection for screen-heavy use.' },
          { slug: 'blue-cut-blue', name: 'Blue Cut Blue', price: 3500, description: 'Blue light filtering lenses with blue reflection technology for extended screen hours.' },
          { slug: 'multicoat-photochromic', name: 'Multicoat Photochromic', price: 4000, description: 'Multicoated photochromic lenses that darken in sunlight and stay clear indoors.' },
          { slug: 'blue-cut-green-photochromic', name: 'Blue Cut Green Photochromic', price: 5000, description: 'Blue cut lenses with green reflection and photochromic darkening in sunlight.' },
          { slug: 'blue-cut-blue-photochromic', name: 'Blue Cut Blue Photochromic', price: 6000, description: 'Blue cut lenses with blue reflection and photochromic darkening for indoor-outdoor use.' }
        ]
      },
      {
        slug: 'exclusive',
        name: 'Exclusive',
        brands: [
          {
            slug: 'abc',
            name: 'A.B.C',
            lensTypes: [
              { slug: 'abc-multicoat', name: 'Multicoat', price: 3000, description: 'Premium multicoated lenses with enhanced anti-reflective layers for crystal-clear vision.' },
              { slug: 'abc-silkcoat', name: 'Silkcoat', price: 4000, description: 'Silk-smooth coated lenses with superior anti-glare and scratch-resistant protection.' },
              { slug: 'abc-blue-cut-blue', name: 'Blue Cut Blue', price: 6500, description: 'Advanced blue light filtering lenses with blue reflection technology for extended screen hours.' },
              { slug: 'abc-multicoat-photochromic', name: 'Multicoat Photochromic', price: 6500, description: 'Premium multicoated photochromic lenses that darken instantly in sunlight.' }
            ]
          },
          {
            slug: 'privo',
            name: 'Privo',
            lensTypes: [
              { slug: 'privo-blue-cut-green', name: 'Blue Cut Green', price: 6500, description: 'Premium blue light filtering lenses with a green reflection for screen-heavy use.' },
              { slug: 'privo-blue-cut-blue', name: 'Blue Cut Blue', price: 9500, description: 'Advanced blue cut lenses with blue reflection technology for maximum screen comfort.' },
              { slug: 'privo-blue-cut-photochromic', name: 'Blue Cut Photochromic', price: 22500, description: 'High-end blue cut photochromic lenses that darken in sunlight while filtering blue light.' }
            ]
          },
          {
            slug: 'zeiss',
            name: 'ZEISS',
            lensTypes: [
              { slug: 'zeiss-duravision-green', name: 'DuraVision Green', price: 19500, description: 'ZEISS DuraVision coating with green reflection for premium clarity and anti-glare.' },
              { slug: 'zeiss-duravision-blue', name: 'DuraVision Blue', price: 29500, description: 'ZEISS DuraVision Blue coating reducing blue light for long screen sessions.' },
              { slug: 'zeiss-blueguard', name: 'BlueGuard', price: 39500, description: 'ZEISS BlueGuard lens with advanced blue light filtering and maximum visual comfort.' },
              { slug: 'zeiss-drivesafe', name: 'DriveSafe Lens', price: 40000, description: 'ZEISS DriveSafe lens optimized for night driving with reduced glare and reflections.' }
            ]
          },
          {
            slug: 'japanese',
            name: 'Japanese',
            lensTypes: [
              { slug: 'japanese-blue-cut-green', name: 'Blue Cut Green', price: 6500, description: 'Japanese-made blue cut lens with green reflection for screen-heavy use.' },
              { slug: 'japanese-blue-cut-blue', name: 'Blue Cut Blue', price: 8500, description: 'Japanese-made blue cut lens with blue reflection technology for extended screen hours.' },
              { slug: 'japanese-blue-cut-photochromic', name: 'Blue Cut Photochromic', price: 13580, description: 'Japanese-made photochromic blue cut lens that darkens in sunlight while filtering blue light.' }
            ]
          }
        ]
      },
      {
        slug: 'high-index',
        name: 'High Index',
        lensTypes: [
          { slug: 'hi-1.60', name: '1.60 Index', priceOnRequest: true, description: 'Thin, lightweight high-index lens. Price on request — confirmed with your prescription.' },
          { slug: 'hi-1.67', name: '1.67 Index', priceOnRequest: true, description: 'Extra-thin high-index lens for higher prescriptions. Price on request.' },
          { slug: 'hi-1.70', name: '1.70 Index', priceOnRequest: true, description: 'Very thin high-index lens for high prescriptions. Price on request.' },
          { slug: 'hi-1.74', name: '1.74 Index', priceOnRequest: true, description: 'Ultra-thin high-index lens for high prescriptions. Price on request.' },
          { slug: 'hi-1.76', name: '1.76 Index', priceOnRequest: true, description: 'Ultra-thin premium high-index lens. Price on request.' }
        ]
      }
    ],
    order: 4
  },
  {
    slug: 'near-vision',
    appliesTo: 'eyeglasses',
    name: 'Near Vision',
    description: 'Clear lenses tuned for close-up reading and desk work.',
    info: 'Optimized for near-range vision with anti-reflective coatings for comfortable reading and screen use.',
    collections: [
      {
        slug: 'essential',
        name: 'Essential',
        lensTypes: [
          { slug: 'hard-coat', name: 'Hard Coat', price: 800, description: 'Hard-coated lenses with scratch-resistant protection for everyday near-vision use.' },
          { slug: 'multicoat', name: 'Multicoat', price: 2000, description: 'Multicoated lenses with anti-reflective layers for clearer close-up vision.' },
          { slug: 'blue-cut', name: 'Blue Cut', price: 2000, description: 'Blue light filtering lenses for comfortable screen and reading sessions.' },
          { slug: 'blue-coating', name: 'Blue Coating', price: 2000, description: 'Lenses with a blue light coating to reduce eye strain during long reading hours.' }
        ]
      },
      {
        slug: 'comfort',
        name: 'Comfort',
        lensTypes: [
          { slug: 'hard-coat', name: 'Hard Coat', price: 1500, description: 'Comfort-grade hard-coated lenses with scratch-resistant protection for daily wear.' },
          { slug: 'multicoat', name: 'Multicoat', price: 2500, description: 'Comfort multicoated lenses with enhanced anti-reflective layers for reduced glare.' },
          { slug: 'blue-cut-green', name: 'Blue Cut Green', price: 2500, description: 'Blue light filtering lenses with a subtle green reflection for screen-heavy use.' },
          { slug: 'blue-cut-blue', name: 'Blue Cut Blue', price: 3500, description: 'Blue light filtering lenses with blue reflection technology for extended screen hours.' }
        ]
      },
      {
        slug: 'exclusive',
        name: 'Exclusive',
        brands: [
          {
            slug: 'abc',
            name: 'A.B.C',
            lensTypes: [
              { slug: 'abc-multicoat', name: 'Multicoat', price: 3000, description: 'Premium multicoated lenses with enhanced anti-reflective layers for crystal-clear near vision.' },
              { slug: 'abc-silkcoat', name: 'Silkcoat', price: 4000, description: 'Silk-smooth coated lenses with superior anti-glare and scratch-resistant protection.' },
              { slug: 'abc-blue-cut-blue', name: 'Blue Cut Blue', price: 6500, description: 'Advanced blue light filtering lenses with blue reflection technology for reading and screen use.' }
            ]
          },
          {
            slug: 'privo',
            name: 'Privo',
            lensTypes: [
              { slug: 'privo-blue-cut-green', name: 'Blue Cut Green', price: 6500, description: 'Premium blue light filtering lenses with a green reflection for comfortable reading.' },
              { slug: 'privo-blue-cut-blue', name: 'Blue Cut Blue', price: 9500, description: 'Advanced blue cut lenses with blue reflection technology for maximum reading comfort.' }
            ]
          },
          {
            slug: 'zeiss',
            name: 'ZEISS',
            lensTypes: [
              { slug: 'zeiss-duravision-green', name: 'DuraVision Green', price: 19500, description: 'ZEISS DuraVision coating with green reflection for premium clarity and anti-glare.' },
              { slug: 'zeiss-duravision-blue', name: 'DuraVision Blue', price: 29500, description: 'ZEISS DuraVision Blue coating reducing blue light for long reading sessions.' },
              { slug: 'zeiss-blueguard', name: 'BlueGuard', price: 39500, description: 'ZEISS BlueGuard lens with advanced blue light filtering and maximum visual comfort.' }
            ]
          },
          {
            slug: 'japanese',
            name: 'Japanese',
            lensTypes: [
              { slug: 'japanese-blue-cut-green', name: 'Blue Cut Green', price: 6500, description: 'Japanese-made blue cut lens with green reflection for comfortable near vision.' },
              { slug: 'japanese-blue-cut-blue', name: 'Blue Cut Blue', price: 8500, description: 'Japanese-made blue cut lens with blue reflection technology for extended reading hours.' }
            ]
          }
        ]
      },
      {
        slug: 'high-index',
        name: 'High Index',
        lensTypes: [
          { slug: 'hi-1.60', name: '1.60 Index', priceOnRequest: true, description: 'Thin, lightweight high-index lens. Price on request — confirmed with your prescription.' },
          { slug: 'hi-1.67', name: '1.67 Index', priceOnRequest: true, description: 'Extra-thin high-index lens for higher prescriptions. Price on request.' },
          { slug: 'hi-1.70', name: '1.70 Index', priceOnRequest: true, description: 'Very thin high-index lens for high prescriptions. Price on request.' },
          { slug: 'hi-1.74', name: '1.74 Index', priceOnRequest: true, description: 'Ultra-thin high-index lens for high prescriptions. Price on request.' },
          { slug: 'hi-1.76', name: '1.76 Index', priceOnRequest: true, description: 'Ultra-thin premium high-index lens. Price on request.' }
        ]
      }
    ],
    order: 5
  },
  {
    slug: 'sun',
    appliesTo: 'common',
    name: 'Sun',
    description: 'Darkened tint lenses for bright outdoor conditions.',
    info: 'Full UV protection with a comfortable dark tint for outdoor wear.',
    delegatesToAppliesTo: 'common',
    order: 8
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

    await LensOption.deleteMany({});
    console.log('🗑️ Cleared existing LensOption documents.');

    await LensOption.insertMany([...COMMON_TINT_OPTIONS, ...EYEGLASSES_OPTIONS]);
    console.log(`✅ Inserted ${COMMON_TINT_OPTIONS.length} common (Sun + tints) + ${EYEGLASSES_OPTIONS.length} eyeglasses lens options.`);

    const total = await LensOption.countDocuments();
    console.log(`📊 LensOption collection now has ${total} documents.`);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
};

seedLensOptions();
