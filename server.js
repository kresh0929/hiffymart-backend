const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/auth/auth-routes');
const adminProductsRouter = require('./routes/admin/products-routes');
const adminOrderRouter = require('./routes/admin/order-routes');

const shopProductsRouter = require('./routes/shop/products-routes');
const shopCartRouter = require('./routes/shop/cart-routes');
const shopAddressRouter = require('./routes/shop/address-routes');
const shopOrderRouter = require('./routes/shop/order-routes');
const shopSearchRouter = require('./routes/shop/search-routes');
const shopReviewRouter = require('./routes/shop/review-routes');
const commonFeatureRouter = require('./routes/common/feature-routes');

// ✅ Connect MongoDB
mongoose.connect('mongodb+srv://kreshverma2909:kreshverma2003@cluster0.ee4wznv.mongodb.net/')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(error => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://hiffymart-frontend.vercel.app',
  'https://hiffymart-frontend-git-main-kresh-kumars-projects.vercel.app',
  'https://hiffymart-frontend-pdg63i54x-kresh-kumars-projects.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma',
    ],
    credentials: true,
  })
);

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrderRouter);

app.use('/api/shop/products', shopProductsRouter);
app.use('/api/shop/cart', shopCartRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use('/api/shop/search', shopSearchRouter);
app.use('/api/shop/review', shopReviewRouter);
app.use('/api/common/feature', commonFeatureRouter);

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server is now running on port ${PORT}`));
