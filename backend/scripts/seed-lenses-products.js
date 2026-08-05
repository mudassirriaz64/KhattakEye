require('dotenv').config();
const mongoose = require('mongoose');
const Lenses = require('../models/Lenses');

const lensesProducts = [
  // ─── Contact Lenses — Transparent ─────────────────────────────
  {
    name: "Acuvue Oasys Hydraclear Transparent",
    slug: "acuvue-oasys-hydraclear-transparent",
    brand: "Acuvue",
    category: "contact-lenses",
    subcategory: "transparent",
    price: 6500,
    oldPrice: 7500,
    description: "Ultra-breathable silicone hydrogel transparent contact lenses with Hydraclear Plus technology for all-day moisture.",
    images: ["https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-ACU-001",
    stock: 45,
    availability: "in-stock",
    rating: 4.9,
    reviewsCount: 32,
    status: "active",
    featured: true,
    wearDuration: "monthly",
    disposalType: "bi-weekly",
    packSize: 6,
    baseCurve: 8.4,
    diameter: 14.0,
    waterContent: 38,
    colorTint: "Clear Transparent"
  },
  {
    name: "Biofinity Sphere Clear Contact Lenses",
    slug: "biofinity-sphere-clear-contact-lenses",
    brand: "CooperVision",
    category: "contact-lenses",
    subcategory: "transparent",
    price: 5800,
    oldPrice: 6500,
    description: "Aquaform technology delivers optimum oxygen permeability and natural wettability in a transparent lens.",
    images: ["https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-BIO-002",
    stock: 30,
    availability: "in-stock",
    rating: 4.8,
    reviewsCount: 19,
    status: "active",
    featured: false,
    wearDuration: "monthly",
    disposalType: "monthly",
    packSize: 6,
    baseCurve: 8.6,
    diameter: 14.2,
    waterContent: 48,
    colorTint: "Clear"
  },

  // ─── Contact Lenses — Colored ──────────────────────────────────
  {
    name: "Bella Natural Hazel Emerald Green",
    slug: "bella-natural-hazel-emerald-green",
    brand: "Bella Lenses",
    category: "contact-lenses",
    subcategory: "colored",
    price: 8500,
    oldPrice: 9900,
    description: "Captivating dual-tone hazel emerald green color lenses designed for stunning natural eye transformations.",
    images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-BEL-003",
    stock: 25,
    availability: "in-stock",
    rating: 5.0,
    reviewsCount: 44,
    status: "active",
    featured: true,
    wearDuration: "yearly",
    disposalType: "yearly",
    packSize: 2,
    baseCurve: 8.6,
    diameter: 14.5,
    waterContent: 38,
    colorTint: "Hazel Emerald Green"
  },
  {
    name: "FreshLook Colorblends Sapphire Blue",
    slug: "freshlook-colorblends-sapphire-blue",
    brand: "Alcon",
    category: "contact-lenses",
    subcategory: "colored",
    price: 4900,
    oldPrice: 5500,
    description: "3-in-1 color technology blends three colors into one for subtle, realistic ocean sapphire blue eyes.",
    images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-FSH-004",
    stock: 40,
    availability: "in-stock",
    rating: 4.7,
    reviewsCount: 28,
    status: "active",
    featured: false,
    wearDuration: "monthly",
    disposalType: "monthly",
    packSize: 2,
    baseCurve: 8.6,
    diameter: 14.5,
    waterContent: 55,
    colorTint: "Sapphire Blue"
  },

  // ─── Optical Lenses — Blue Lens ───────────────────────────────
  {
    name: "Khattak Blue-Shield 1.61 High Index",
    slug: "khattak-blue-shield-161-high-index",
    brand: "Khattak Optics",
    category: "lenses",
    subcategory: "blue-cut",
    price: 9500,
    oldPrice: 12000,
    description: "Advanced blue-light blocking spectacle lens filtering 99% of harmful digital blue radiation with hydrophobic coating.",
    images: ["https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-OPT-005",
    stock: 50,
    availability: "in-stock",
    rating: 4.9,
    reviewsCount: 52,
    status: "active",
    featured: true,
    wearDuration: "daily",
    disposalType: "permanent",
    packSize: 2,
    baseCurve: 4.0,
    diameter: 75,
    colorTint: "Anti-Blue Reflection"
  },
  {
    name: "Zeiss BlueGuard Anti-Fatigue Lens",
    slug: "zeiss-blueguard-anti-fatigue-lens",
    brand: "Zeiss",
    category: "lenses",
    subcategory: "blue-cut",
    price: 18500,
    oldPrice: 21000,
    description: "In-material blue light filtering paired with anti-reflective DuraVision coating for superior visual clarity.",
    images: ["https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-ZIS-006",
    stock: 20,
    availability: "in-stock",
    rating: 5.0,
    reviewsCount: 15,
    status: "active",
    featured: false,
    wearDuration: "daily",
    disposalType: "permanent",
    packSize: 2,
    baseCurve: 4.5,
    diameter: 70,
    colorTint: "Blue Guard"
  },

  // ─── Optical Lenses — Computer Lens ────────────────────────────
  {
    name: "Digital Pro Anti-Glare Computer Lens",
    slug: "digital-pro-anti-glare-computer-lens",
    brand: "Khattak Optics",
    category: "lenses",
    subcategory: "computer",
    price: 7800,
    oldPrice: 9000,
    description: "Optimized intermediate focus lenses tailored for desktop monitor distance to prevent digital eye strain.",
    images: ["https://images.unsplash.com/photo-1516715094483-75da7dee9758?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-CMP-007",
    stock: 35,
    availability: "in-stock",
    rating: 4.8,
    reviewsCount: 37,
    status: "active",
    featured: true,
    wearDuration: "daily",
    disposalType: "permanent",
    packSize: 2,
    baseCurve: 4.0,
    diameter: 70,
    colorTint: "Clear Anti-Glare"
  },
  {
    name: "OfficeView Screen Comfort 1.56",
    slug: "officeview-screen-comfort-156",
    brand: "Essilor",
    category: "lenses",
    subcategory: "computer",
    price: 12500,
    oldPrice: 14500,
    description: "Wide mid-range digital corridor lenses providing wide comfortable viewing zone across computer monitors.",
    images: ["https://images.unsplash.com/photo-1516715094483-75da7dee9758?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-OFF-008",
    stock: 18,
    availability: "in-stock",
    rating: 4.9,
    reviewsCount: 22,
    status: "active",
    featured: false,
    wearDuration: "daily",
    disposalType: "permanent",
    packSize: 2,
    baseCurve: 4.2,
    diameter: 72,
    colorTint: "Clear"
  },

  // ─── Optical Lenses — Transition Lens ──────────────────────────
  {
    name: "Transitions Gen 8 Light Intelligent Amber",
    slug: "transitions-gen-8-light-intelligent-amber",
    brand: "Transitions",
    category: "lenses",
    subcategory: "photochromic",
    price: 24500,
    oldPrice: 28000,
    description: "Next-gen photochromic technology activating rapidly outdoors into dark warm amber sunglasses tint.",
    images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-TRN-009",
    stock: 15,
    availability: "in-stock",
    rating: 5.0,
    reviewsCount: 61,
    status: "active",
    featured: true,
    wearDuration: "daily",
    disposalType: "permanent",
    packSize: 2,
    baseCurve: 4.5,
    diameter: 75,
    colorTint: "Amber Transition"
  },
  {
    name: "Photochromic Smart Grey 1.67",
    slug: "photochromic-smart-grey-167",
    brand: "Khattak Optics",
    category: "lenses",
    subcategory: "photochromic",
    price: 16800,
    oldPrice: 19500,
    description: "High-index ultra-thin photochromic lenses darkening to deep graphite grey under direct sunlight.",
    images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&auto=format&fit=crop&q=80"],
    sku: "LNS-SMR-010",
    stock: 22,
    availability: "in-stock",
    rating: 4.7,
    reviewsCount: 14,
    status: "active",
    featured: false,
    wearDuration: "daily",
    disposalType: "permanent",
    packSize: 2,
    baseCurve: 4.0,
    diameter: 70,
    colorTint: "Graphite Grey"
  }
];

async function seedLensesProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    for (const prod of lensesProducts) {
      await Lenses.findOneAndUpdate(
        { slug: prod.slug },
        prod,
        { upsert: true, returnDocument: 'after', runValidators: true }
      );
      console.log(`✓ Seeded lens product: ${prod.name} (${prod.subcategory})`);
    }

    console.log('\nAll Lenses products seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding lenses products:', err);
    process.exit(1);
  }
}

seedLensesProducts();
