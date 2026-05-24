require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payments');
const secondhandRoutes = require('./routes/secondhand');

const ecoRoutes = require('./routes/eco');

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || '*';

// Normalize CORS origin (remove trailing slash)
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === '*' || allowedOrigin === '*') {
      callback(null, true);
    } else {
      // Remove trailing slash for comparison
      const normalizedAllowed = allowedOrigin.replace(/\/$/, '');
      const normalizedOrigin = origin.replace(/\/$/, '');
      if (normalizedOrigin === normalizedAllowed) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'EcoCreds backend is running',
    docs: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/secondhand', secondhandRoutes);

app.use('/api/eco', ecoRoutes);

const PORT = process.env.PORT || 5000;

mongoose
.connect(process.env.MONGO_URI)
.then(() =>
  app.listen(PORT, () =>
    console.log(`Server running on ${PORT}`)
  )
)
.catch(err => console.error(err));
console.log('RAZORPAY_KEY_ID present:', !!process.env.RAZORPAY_KEY_ID);
console.log('RAZORPAY_KEY_SECRET present:', !!process.env.RAZORPAY_KEY_SECRET);