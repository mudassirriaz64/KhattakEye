const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

async function backfill() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Product = require('../backend/models/Product');
    const products = await Product.find({ 'variants.images': { $regex: 'blob:' } });
    console.log('CORRUPTED PRODUCTS COUNT:', products.length);
    
    for (const p of products) {
      console.log('Cleaning Product ID:', p._id, '| Name:', p.name);
      if (Array.isArray(p.variants)) {
        p.variants = p.variants.map(v => {
          const cleanedImages = (v.images || []).filter(img => typeof img === 'string' && !img.startsWith('blob:'));
          const cleanedImage = v.image && v.image.startsWith('blob:') ? '' : v.image;
          return {
            ...v,
            images: cleanedImages,
            image: cleanedImage || (cleanedImages.length > 0 ? cleanedImages[0] : '')
          };
        });
        await p.save();
        console.log('-> Cleaned and saved:', p.name);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

backfill();
