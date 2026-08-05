require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Coupon = require('../models/Coupon');
const { compressMedia } = require('../utils/mediaCompression');
const { uploadMedia, getCloudinaryFolder } = require('../utils/cloudinary');

// Seed categories with embedded subcategories array
const categoriesData = [
  {
    name: 'Sunglasses',
    slug: 'sunglasses',
    description: 'Premium sunglasses with UV400 protection',
    featured: true,
    status: 'active',
    subcategories: [
      { name: 'Polarized Shades', slug: 'polarized-shades', description: 'Glare-reducing polarized lenses', productCount: 16 },
      { name: 'Driving Sunglasses', slug: 'driving-sunglasses', description: 'High contrast lenses for optimal driving vision', productCount: 12 },
      { name: 'Fashion & Luxury', slug: 'fashion-luxury', description: 'Statement fashion frames', productCount: 22 },
      { name: 'Sports Performance', slug: 'sports-performance', description: 'Wrap-around aerodynamic frames', productCount: 9 }
    ]
  },
  {
    name: 'Eyeglasses',
    slug: 'eyeglasses',
    description: 'Prescription & everyday optical frames',
    featured: true,
    status: 'active',
    subcategories: [
      { name: 'Prescription Glasses', slug: 'prescription-glasses', description: 'Single vision and progressive frames', productCount: 30 },
      { name: 'Computer & Blue Light', slug: 'blue-light', description: 'Digital screen eye strain protection', productCount: 25 },
      { name: 'Reading Glasses', slug: 'reading-glasses', description: 'Compact magnification frames', productCount: 14 },
      { name: 'Rimless & Minimalist', slug: 'rimless-frames', description: 'Ultra lightweight rimless design', productCount: 18 }
    ]
  }
];

const mockImagePaths = [
  path.join(__dirname, '../seed-assets/placeholder1.png'),
  path.join(__dirname, '../seed-assets/placeholder2.png'),
  path.join(__dirname, '../seed-assets/placeholder3.png')
];

// Reusable function to upload an image locally to cloudinary after compression
const processAndUploadImage = async (localPath, resourceType, subType = 'images') => {
  if (!fs.existsSync(localPath)) {
    console.warn(`Local image not found: ${localPath}. Returning fallback string.`);
    return `fallback/${path.basename(localPath)}`;
  }
  
  let compressedPath = null;
  try {
    console.log(`Compressing ${localPath}...`);
    compressedPath = await compressMedia(localPath, 'image');
    
    const folder = getCloudinaryFolder(resourceType, subType);
    console.log(`Uploading compressed image to ${folder}...`);
    
    const result = await uploadMedia(compressedPath, folder);
    return result.public_id;
  } catch (err) {
    console.error(`Failed to process/upload ${localPath}`, err);
    throw err;
  } finally {
    // Cleanup temporary compressed file
    if (compressedPath && fs.existsSync(compressedPath)) {
      fs.unlinkSync(compressedPath);
    }
  }
};

const runSeed = async () => {
  try {
    await connectDB();
    console.log('Connected to DB for seeding.');

    // 1. Seed Categories
    for (const cat of categoriesData) {
      let existingCat = await Category.findOne({ slug: cat.slug });
      if (!existingCat) {
        // Upload a category image (just pick one mock image)
        const imagePublicId = await processAndUploadImage(mockImagePaths[0], 'categories');
        
        await Category.create({
          ...cat,
          image: imagePublicId
        });
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    // 2. Seed luxury Brands
    const luxuryBrands = [
      { name: 'Louis Vuitton', slug: 'louis-vuitton' },
      { name: 'Prada', slug: 'prada' },
      { name: 'Gucci', slug: 'gucci' },
      { name: 'Ray-Ban', slug: 'ray-ban' },
      { name: 'Tom Ford', slug: 'tom-ford' },
      { name: 'Cartier', slug: 'cartier' },
      { name: 'Dior', slug: 'dior' }
    ];

    for (const b of luxuryBrands) {
      let brandDoc = await Brand.findOne({ slug: b.slug });
      if (!brandDoc) {
        const logoId = await processAndUploadImage(mockImagePaths[1], 'brands');
        await Brand.create({ ...b, logo: logoId });
        console.log(`Created brand: ${b.name}`);
      }
    }
    const brand = await Brand.findOne({ slug: 'louis-vuitton' });

    // 3. Seed Products
    const productsToSeed = 10;
    const catDocs = await Category.find({ type: 'category' });
    const fallbackCats = await Category.find().limit(5);
    const productCategories = catDocs.length > 0 ? catDocs : fallbackCats;
    const stylesDocs = await Category.find({ type: 'style' });

    for (let i = 1; i <= productsToSeed; i++) {
      const slug = `seeded-product-${i}`;
      let existingProduct = await Product.findOne({ slug });
      
      if (!existingProduct) {
        if (productCategories.length === 0) {
          console.warn(`Skipping ${slug}: no categories available to assign.`);
          continue;
        }
        const catSlug = productCategories[i % productCategories.length].slug;
        
        // upload product images
        const mainImageId = await processAndUploadImage(mockImagePaths[0], 'products', 'images');
        const hoverImageId = await processAndUploadImage(mockImagePaths[1], 'products', 'images');
        const variantImageId = await processAndUploadImage(mockImagePaths[2], 'products', 'images');

        await Product.create({
          name: `Seeded Product ${i}`,
          brand: brand.name,
          slug,
          category: catSlug,
          price: 5000 + (i * 500),
          description: `Description for seeded product ${i}`,
          shortDescription: `Short description ${i}`,
          images: [mainImageId],
          hoverImage: hoverImageId,
          stock: 50,
          sku: `SKU-${i}-SEED`,
          frameShape: 'Rectangle',
          frameMaterial: 'Acetate',
          lensType: 'Standard',
          lensColor: 'Clear',
          frameColor: 'Black',
          frameSize: 'Medium',
          availability: 'in-stock',
          warranty: '1 Year',
          isNewArrival: i % 2 === 0,
          isBestSeller: i % 3 === 0,
          variants: [
            {
              color: '#000000',
              colorName: 'Black',
              image: variantImageId,
              stock: 25
            }
          ]
        });
        console.log(`Created product: Seeded Product ${i}`);
      } else {
        console.log(`Product already exists: ${slug}`);
      }
    }

    // 4. Seed Coupons
    const couponsData = [
      { code: 'KHATTAK10', discountPercent: 10, expiryDate: new Date('2027-12-31'), minOrderValue: 0, usageLimit: 1000 },
      { code: 'WELCOME15', discountPercent: 15, expiryDate: new Date('2027-12-31'), minOrderValue: 2500, usageLimit: 500 }
    ];

    for (const c of couponsData) {
      const existing = await Coupon.findOne({ code: c.code });
      if (!existing) {
        await Coupon.create(c);
        console.log(`Created coupon: ${c.code}`);
      } else {
        console.log(`Coupon already exists: ${c.code}`);
      }
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed script failed:', error);
    process.exit(1);
  }
};

runSeed();
