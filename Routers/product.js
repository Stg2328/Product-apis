const express = require('express');
const Product = require('../Model/product');
const router = express.Router();

const validateProduct = (product) => {
  const errors = [];
  if (!product.name || typeof product.name !== 'string') {
    errors.push('Name is required and must be a string.');
  }
  if (product.price === undefined || typeof product.price !== 'number') {
    errors.push('Price is required and must be a number.');
  }
  if (product.description && typeof product.description !== 'string') {
    errors.push('Description must be a string.');
  }
  if (product.category && typeof product.category !== 'string') {
    errors.push('Category must be a string.');
  }
  if (product.stock !== undefined && typeof product.stock !== 'number') {
    errors.push('Stock must be a number.');
  }
  if (product.imageUrl && typeof product.imageUrl !== 'string') {
    errors.push('Image URL must be a string.');
  }
  return errors;
};

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error!!!' });
  }
});

router.post('/', async (req, res) => {
  const validationErrors = validateProduct(req.body);
  if (validationErrors.length) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error getting product' });
  }
});

router.put('/:id', async (req, res) => {
  const validationErrors = validateProduct(req.body);
  if (validationErrors.length) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    const updatedProductData = {};
    let changesDetected = false;

    for (const key of Object.keys(req.body)) {
      if (req.body[key] !== existingProduct[key]) {
        updatedProductData[key] = req.body[key];
        changesDetected = true;
      }
    }

    if (!changesDetected) {
      return res.status(200).json({ message: 'No changes detected.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedProductData, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
    try {
      const productToDelete = await Product.findByIdAndDelete(req.params.id);
      
      if (!productToDelete) {
        return res.status(404).json({ message: 'product not found.' });
      }
  
      res.status(200).json({ message: 'product deleted.' });
    } catch (err) {
      res.status(500).json({ message: 'server error!!.' });
    }
 });
  

module.exports = router;
