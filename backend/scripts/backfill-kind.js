require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// One-off migration: backfill the missing `kind` discriminator field.
// Signal used: category-based. All 100 affected docs are in the
// `eyeglasses`/`sunglasses` glasses categories, have `frameShape` populated,
// and have no `wearDuration` (lenses-only field). The 10 lens docs already
// carry `kind: 'lenses'` and are protected by the `kind: null` guard below.

const GLASSES_CATEGORIES = ['eyeglasses', 'sunglasses'];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const totalBefore = await Product.countDocuments({});
    const glassesBefore = await Product.countDocuments({ kind: 'glasses' });
    const lensesBefore = await Product.countDocuments({ kind: 'lenses' });
    const nullKindBefore = await Product.countDocuments({ kind: null });
    console.log('BEFORE  -> total:', totalBefore, '| glasses:', glassesBefore, '| lenses:', lensesBefore, '| null-kind:', nullKindBefore);

    const nullKindCats = await Product.distinct('category', { kind: null });
    console.log('Null-kind categories present:', JSON.stringify(nullKindCats));

    // Safety: any null-kind doc NOT in glasses categories should be reported, not silently rewritten.
    const unexpected = await Product.find({ kind: null, category: { $nin: GLASSES_CATEGORIES } }, { category: 1, _id: 1 }).lean();
    if (unexpected.length > 0) {
      console.error(`ABORT: ${unexpected.length} null-kind doc(s) outside glasses categories:`, JSON.stringify(unexpected.map(d => ({ id: d._id, category: d.category }))));
      process.exit(1);
    }

    // NOTE: Mongoose strips the `kind` discriminator key from base-model
    // updates, so use the raw collection driver for the write.
    const res = await Product.collection.updateMany(
      { kind: null, category: { $in: GLASSES_CATEGORIES } },
      { $set: { kind: 'glasses' } }
    );
    console.log(`Backfilled ${res.modifiedCount} document(s) to kind="glasses"`);

    const totalAfter = await Product.countDocuments({});
    const glassesAfter = await Product.countDocuments({ kind: 'glasses' });
    const lensesAfter = await Product.countDocuments({ kind: 'lenses' });
    const nullKindAfter = await Product.countDocuments({ kind: null });
    console.log('AFTER   -> total:', totalAfter, '| glasses:', glassesAfter, '| lenses:', lensesAfter, '| null-kind:', nullKindAfter);

    if (totalBefore !== totalAfter) {
      console.error(`FAIL: total changed ${totalBefore} -> ${totalAfter}`);
      process.exit(1);
    }
    if (lensesAfter !== lensesBefore) {
      console.error(`FAIL: lens docs changed ${lensesBefore} -> ${lensesAfter}`);
      process.exit(1);
    }
    if (glassesAfter !== 100 || nullKindAfter !== 0) {
      console.error('FAIL: expected glasses=100 and null-kind=0');
      process.exit(1);
    }
    console.log('Verification passed. No documents lost or duplicated.');
    process.exit(0);
  } catch (err) {
    console.error('Error backfilling kind:', err);
    process.exit(1);
  }
}

run();
