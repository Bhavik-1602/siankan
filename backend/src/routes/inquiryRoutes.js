import express from 'express';
import { createInquiry, getInquiries, getAllInquiries, updateInquiryStatus } from '../controllers/inquiryController.js';
import { protect, optionalProtect, admin } from '../middleware/authMiddleware.js';
import { inquirySchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', optionalProtect, inquirySchema, createInquiry);
router.get('/user/:userId', protect, getInquiries);

// Admin-only routes
router.get('/', protect, admin, getAllInquiries);
router.put('/:id/status', protect, admin, updateInquiryStatus);

export default router;
