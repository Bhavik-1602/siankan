import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoute from './routes/uploadRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { errorHandler } from './middleware/errorMiddleware.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: '*', // In production, replace with specific domain(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logger
app.use(morgan('dev'));

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend service is running smoothly' });
});

// Wire routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

// Listen to port
app.listen(PORT, () => {
  logger.info(`Server successfully started on port ${PORT}`);
});

export default app;
