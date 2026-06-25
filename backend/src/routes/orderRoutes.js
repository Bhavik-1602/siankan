import express from 'express';
import { createOrder, getOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, optionalProtect, admin } from '../middleware/authMiddleware.js';
import { orderSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', optionalProtect, orderSchema, createOrder);
router.get('/user/:userId', protect, getOrders);

// Admin-only order routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
