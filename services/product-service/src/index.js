const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://product-mongo:27017/products';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String, default: 'https://via.placeholder.com/300' },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'product-service' }));

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const products = await Product.find(query);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product
app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update stock
app.patch('/api/products/:id/stock', async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: -quantity } },
      { new: true }
    );
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed sample products
app.post('/api/products/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany([
      { name: 'iPhone 15 Pro', description: 'Latest Apple smartphone', price: 999, category: 'Electronics', stock: 50 },
      { name: 'MacBook Pro M3', description: 'Powerful laptop', price: 1999, category: 'Electronics', stock: 30 },
      { name: 'Nike Air Max', description: 'Running shoes', price: 150, category: 'Footwear', stock: 100 },
      { name: 'Levi\'s 501 Jeans', description: 'Classic jeans', price: 80, category: 'Clothing', stock: 200 },
      { name: 'Sony WH-1000XM5', description: 'Noise cancelling headphones', price: 350, category: 'Electronics', stock: 75 },
    ]);
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Product Service connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Product Service running on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
