require('dotenv').config({path: './.env'});
const mongoose = require('mongoose');
const Brand = require('./models/Brand');

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOURI).then(async () => {
  const brands = await Brand.find({}).lean();
  console.log('TOTAL_BRANDS_IN_DB:', brands.length);
  
  // Set top brands as featured if none are featured yet
  const featuredCount = await Brand.countDocuments({ featured: true });
  if (featuredCount === 0) {
    const featuredNames = ["Khattak Atelier", "Ray-Ban", "Gucci", "Tom Ford", "Cartier", "Dior", "Oakley", "Persol", "Prada", "Louis Vuitton"];
    await Brand.updateMany(
      { name: { $in: featuredNames } },
      { $set: { featured: true } }
    );
    console.log('Set initial featured brands:', featuredNames);
  }

  const updated = await Brand.find({ featured: true }).lean();
  console.log('FEATURED_BRANDS:', updated.map(b => b.name));

  mongoose.connection.close();
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
