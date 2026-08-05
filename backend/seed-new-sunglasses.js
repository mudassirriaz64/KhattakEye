const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/khattak_eye';

async function seedProduct() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const newProduct = {
      name: "Ray-Ban Aviator Classic Gold Edition",
      brand: "Ray-Ban",
      slug: "ray-ban-aviator-classic-gold-edition",
      category: "sunglasses",
      subcategory: "fashion-luxury",
      price: 32500,
      oldPrice: 38000,
      description: "Originally designed for U.S. aviators in 1937, Ray-Ban Classic Aviators are an iconic style that combines classic pilot styling with exceptional quality, performance and comfort.",
      shortDescription: "Iconic gold aviator sunglasses with crystal G-15 polarized lenses.",
      images: [
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&fit=crop",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&fit=crop"
      ],
      hoverImage: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&fit=crop",
      rating: 4.9,
      reviewCount: 48,
      badges: ["best-seller", "premium"],
      variants: [
        {
          color: "#D4AF37",
          colorName: "Classic Gold / G-15 Green",
          image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&fit=crop",
          stock: 15
        },
        {
          color: "#000000",
          colorName: "Matte Black / Dark Grey",
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&fit=crop",
          stock: 10
        }
      ],
      specs: [
        { label: "Frame Material", value: "Polished Gold Metal" },
        { label: "Lens Material", value: "Crystal G-15 Glass" },
        { label: "Lens Protection", value: "100% UV400 Polarized" },
        { label: "Bridge Width", value: "14 mm" },
        { label: "Lens Width", value: "58 mm" },
        { label: "Temple Length", value: "135 mm" }
      ],
      features: [
        "Gold-tone metal frame",
        "Classic teardrop aviator lenses",
        "100% UV protection & anti-glare polarization",
        "Includes authentic Ray-Ban leather case & cleaning cloth"
      ],
      stock: 25,
      sku: "RB-3025-GOLD-01",
      gender: ["men", "women", "unisex"],
      frameShape: "Aviator",
      frameMaterial: "Metal",
      lensType: "Polarized",
      lensColor: "Green G-15",
      frameColor: "Gold",
      frameSize: "Medium",
      weight: "31g",
      uvProtection: true,
      warranty: "2 Years Manufacturer Warranty",
      availability: "in-stock",
      discount: 14,
      featured: true
    };

    // Upsert product by slug
    const product = await Product.findOneAndUpdate(
      { slug: newProduct.slug },
      newProduct,
      { upsert: true, new: true, runValidators: true }
    );

    console.log('Successfully added product:', product.name);
    console.log('Product Slug:', product.slug);
    console.log('Product ID:', product._id.toString());
    process.exit(0);
  } catch (err) {
    console.error('Error seeding product:', err);
    process.exit(1);
  }
}

seedProduct();
