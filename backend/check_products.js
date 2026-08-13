require('dotenv').config({path: './.env'});
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOURI).then(async () => {
  const result = await Product.updateMany(
    { status: { $nin: ['active', 'archived', 'draft'] } },
    { $set: { status: 'active', isDeleted: false } }
  );
  console.log('UPDATED_PRODUCTS_STATUS:', result);

  const activeCount = await Product.countDocuments({ status: 'active', isDeleted: { $ne: true } });
  console.log('NEW_ACTIVE_PRODUCT_COUNT:', activeCount);

  mongoose.connection.close();
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
