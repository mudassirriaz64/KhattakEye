require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const fourCategories = [
  {
    name: 'Eyeglasses',
    slug: 'eyeglasses',
    description: 'Prescription & everyday optical frames',
    productKind: 'glasses',
    type: 'category',
    featured: true,
    order: 1,
    status: 'active',
    subcategories: [
      { name: 'Prescription Glasses', slug: 'prescription-glasses', description: 'Single vision and progressive frames', group: 'Category' },
      { name: 'Computer & Blue Light', slug: 'blue-light', description: 'Digital screen eye strain protection', group: 'Category' },
      { name: 'Reading Glasses', slug: 'reading-glasses', description: 'Compact magnification frames', group: 'Styles' },
      { name: 'Rimless & Minimalist', slug: 'rimless-frames', description: 'Ultra lightweight rimless design', group: 'Collections' }
    ]
  },
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    description: 'Premium sunglasses with UV400 protection',
    productKind: 'glasses',
    type: 'category',
    featured: true,
    order: 2,
    status: 'active',
    subcategories: [
      { name: 'Polarized Shades', slug: 'polarized-shades', description: 'Glare-reducing polarized lenses', group: 'Category' },
      { name: 'Driving Sunglasses', slug: 'driving-sunglasses', description: 'High contrast lenses for optimal driving vision', group: 'Styles' },
      { name: 'Fashion & Luxury', slug: 'fashion-luxury', description: 'Statement fashion frames', group: 'Featured' },
      { name: 'Sports Performance', slug: 'sports-performance', description: 'Wrap-around aerodynamic frames', group: 'Category' }
    ]
  },
  {
    name: 'Contact Lenses',
    slug: 'contact-lenses',
    description: 'Daily, monthly, yearly, colored and specialty contact lenses',
    productKind: 'lenses',
    type: 'category',
    featured: true,
    order: 3,
    status: 'active',
    subcategories: [
      { name: 'Daily', slug: 'daily', description: 'Daily contact lenses', group: 'Shop by Type' },
      { name: 'Monthly', slug: 'monthly', description: 'Monthly contact lenses', group: 'Shop by Type' },
      { name: 'Yearly', slug: 'yearly', description: 'Yearly contact lenses', group: 'Shop by Type' },
      { name: 'Colored', slug: 'colored', description: 'Colored contact lenses', group: 'Shop by Type' },
      { name: 'Cosmetic', slug: 'cosmetic', description: 'Cosmetic contact lenses', group: 'Shop by Type' },
      { name: 'Toric (Astigmatism)', slug: 'toric', description: 'Astigmatism correction lenses', group: 'Shop by Need' },
      { name: 'Multifocal', slug: 'multifocal', description: 'Presbyopia correction lenses', group: 'Shop by Need' },
      { name: 'Daily Disposable', slug: 'daily-disposable', description: 'Single-use daily disposable lenses', group: 'Shop by Need' }
    ]
  },
  {
    name: 'Lenses',
    slug: 'lenses',
    description: 'Optical prescription lenses & protective lens coatings',
    productKind: 'lenses',
    type: 'category',
    featured: true,
    order: 4,
    status: 'active',
    subcategories: [
      { name: 'Single Vision', slug: 'single-vision', description: 'Standard single vision lenses', group: 'Prescription' },
      { name: 'Progressive', slug: 'progressive', description: 'No-line multifocal progressive lenses', group: 'Prescription' },
      { name: 'Reading', slug: 'reading', description: 'Near vision reading lenses', group: 'Prescription' },
      { name: 'Computer Lenses', slug: 'computer', description: 'Intermediate distance digital lenses', group: 'Prescription' },
      { name: 'Blue Cut', slug: 'blue-cut', description: 'HEV blue light blocking coating', group: 'Treatments' },
      { name: 'Anti Reflective', slug: 'anti-reflective', description: 'Anti-glare crystal clear coating', group: 'Treatments' },
      { name: 'Photochromic', slug: 'photochromic', description: 'Light intelligent transition lenses', group: 'Treatments' },
      { name: 'Scratch Resistant', slug: 'scratch-resistant', description: 'Hard coat scratch resistance', group: 'Treatments' },
      { name: 'Thin & Light', slug: 'thin-light', description: 'High index ultra thin lenses', group: 'Featured' },
      { name: 'Premium Digital', slug: 'premium-digital', description: 'Custom digital freeform optics', group: 'Featured' }
    ]
  }
];

async function seedAllFourCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    for (const cat of fourCategories) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, returnDocument: 'after', runValidators: true }
      );
      console.log(`✓ Seeded parent category: ${cat.name} (${cat.subcategories.length} subcategories)`);
    }

    console.log('\nAll 4 parent categories seeded into MongoDB Atlas successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding categories:', err);
    process.exit(1);
  }
}

seedAllFourCategories();
