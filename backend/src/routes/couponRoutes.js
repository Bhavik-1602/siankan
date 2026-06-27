import express from 'express';
import { 
  getCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon,
  validateCoupon 
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { couponSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public / Authenticated route to validate a coupon
router.post('/validate', validateCoupon);

// Admin-only coupon management routes
router.get('/', protect, admin, getCoupons);
router.post('/', protect, admin, couponSchema, createCoupon);
router.put('/:id', protect, admin, couponSchema, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

export default router;
