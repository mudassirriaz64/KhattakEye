const mongoose = require('mongoose');
const dotenv = require('dotenv');
path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Product = require('../models/Product');
const Glasses = require('../models/Glasses');
const Lenses = require('../models/Lenses');

async function testDiscriminators() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI not defined in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Mongo Atlas");

    // Test 1: Try saving a glasses document with lens-only baseCurve field
    const testGlasses = new Glasses({
      name: "Test Glasses Discriminator",
      brand: "Test Brand",
      slug: `test-glasses-${Date.now()}`,
      category: "sunglasses",
      price: 15000,
      description: "Test glasses description",
      shortDescription: "Short test desc",
      images: ["test_img_1"],
      stock: 5,
      sku: `TEST-GLS-${Date.now()}`,
      frameShape: "Square",
      frameMaterial: "Acetate",
      baseCurve: 8.6 // Lens-only field!
    });

    const savedGlasses = await testGlasses.save();
    console.log("\n[TEST 1] Saved Glasses:");
    console.log("  kind:", savedGlasses.kind);
    console.log("  frameShape:", savedGlasses.frameShape);
    console.log("  baseCurve (should be undefined):", savedGlasses.baseCurve);

    if (savedGlasses.kind === 'glasses' && savedGlasses.baseCurve === undefined) {
      console.log("  ✓ SUCCESS: Glasses model correctly ignored baseCurve field!");
    } else {
      console.error("  ✗ FAILED: Glasses model did not strip baseCurve field!");
    }

    // Test 2: Save a lenses document with glasses-only frameShape field
    const testLenses = new Lenses({
      name: "Test Lenses Discriminator",
      brand: "Bella",
      slug: `test-lenses-${Date.now()}`,
      category: "contact-lenses",
      price: 4500,
      description: "Test lenses description",
      shortDescription: "Short test desc",
      images: ["test_lens_img_1"],
      stock: 20,
      sku: `TEST-LNS-${Date.now()}`,
      wearDuration: "monthly",
      disposalType: "Monthly Disposable",
      baseCurve: 8.6,
      diameter: 14.2,
      frameShape: "Aviator" // Glasses-only field!
    });

    const savedLenses = await testLenses.save();
    console.log("\n[TEST 2] Saved Lenses:");
    console.log("  kind:", savedLenses.kind);
    console.log("  wearDuration:", savedLenses.wearDuration);
    console.log("  frameShape (should be undefined):", savedLenses.frameShape);

    if (savedLenses.kind === 'lenses' && savedLenses.frameShape === undefined) {
      console.log("  ✓ SUCCESS: Lenses model correctly ignored frameShape field!");
    } else {
      console.error("  ✗ FAILED: Lenses model did not strip frameShape field!");
    }

    // Test 3: Query base Product model with kind filter
    const glassesResult = await Product.find({ kind: 'glasses', sku: savedGlasses.sku });
    const lensesResult = await Product.find({ kind: 'lenses', sku: savedLenses.sku });
    console.log("\n[TEST 3] Base Product Collection Query:");
    console.log("  Glasses found by kind='glasses':", glassesResult.length === 1);
    console.log("  Lenses found by kind='lenses':", lensesResult.length === 1);

    // Clean up test documents
    await Product.deleteOne({ _id: savedGlasses._id });
    await Product.deleteOne({ _id: savedLenses._id });
    console.log("\nCleaned up test documents successfully.");

    process.exit(0);
  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  }
}

testDiscriminators();
