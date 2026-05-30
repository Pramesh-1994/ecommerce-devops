const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://payment-mongo:27017/payments';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Payment Schema
const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['credit_card', 'debit_card', 'upi', 'netbanking'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
  transactionId: { type: String },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'payment-service' }));

// Process payment
app.post('/api/payments', async (req, res) => {
  try {
    const { orderId, userId, amount, method } = req.body;

    // Simulate payment processing
    const isSuccess = Math.random() > 0.1; // 90% success rate
    const transactionId = 'TXN' + Date.now();

    const payment = await Payment.create({
      orderId, userId, amount, method,
      status: isSuccess ? 'success' : 'failed',
      transactionId,
    });

    if (isSuccess) {
      res.status(201).json({ success: true, message: 'Payment successful', data: payment });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed', data: payment });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payment by order
app.get('/api/payments/order/:orderId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all payments
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Payment Service connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Payment Service running on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
