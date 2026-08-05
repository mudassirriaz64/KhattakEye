require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const lensesCategories = [
  {
    name: 'Shop by Type',
    slug: 'shop-by-type',
    description: 'Category grouping for contact lenses by wear duration and usage',
    productKind: 'lenses',
    type: 'category',
    featured: true,
    status: 'active',
    subcategories: [
      { name: 'Daily', slug: 'daily', description: 'Daily contact lenses' },
      { name: 'Monthly', slug: 'monthly', description: 'Monthly contact lenses' },
      { name: 'Yearly', slug: 'yearly', description: 'Yearly contact lenses' },
      { name: 'Colored', slug: 'colored', description: 'Colored contact lenses' },
      { name: 'Cosmetic', slug: 'cosmetic', description: 'Cosmetic contact lenses' }
    ]
  },
  {
    name: 'Shop by Need',
    slug: 'shop-by-need',
    description: 'Style & specialty grouping for contact lenses by vision need',
    productKind: 'lenses',
    type: 'style',
    featured: true,
    status: 'active',
    subcategories: [
      { name: 'Toric (Astigmatism)', slug: 'toric', description: 'Astigmatism correction lenses' },
      { name: 'Multifocal', slug: 'multifocal', description: 'Presbyopia correction lenses' },
      { name: 'Daily Disposable', slug: 'daily-disposable', description: 'Single-use daily disposable lenses' }
    ]
  }
];

async function seedLensesCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    for (const catData of lensesCategories) {
      await Category.findOneAndUpdate(
        { slug: catData.slug },
        catData,
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`Seeded category: ${catData.name}`);
    }

    console.log('Lenses categories seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding lenses categories:', err);
    process.exit(1);
  }
}

seedLensesCategories();
