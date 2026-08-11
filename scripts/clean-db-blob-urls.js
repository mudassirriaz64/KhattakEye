const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const products = await db.collection('products').find({}).toArray();
  let count = 0;

  for (const p of products) {
    if (JSON.stringify(p).includes('blob:')) {
      const cleanedVariants = (p.variants || []).map(v => ({
        ...v,
        images: (v.images || []).filter(i => typeof i === 'string' && !i.includes('blob:')),
        image: (v.image && v.image.includes('blob:')) ? '' : (v.image || '')
      }));

      await db.collection('products').updateOne(
        { _id: p._id },
        { $set: { variants: cleanedVariants } }
      );
      count++;
      console.log('SUCCESSFULLY CLEANED DB RECORD:', p._id, p.name);
    }
  }

  console.log('TOTAL CLEANED RECORDS:', count);
  await mongoose.disconnect();
}

run();
