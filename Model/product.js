const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
