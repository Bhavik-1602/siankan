import express from 'express';
import { 
  getReviewsByProduct, 
  createReview, 
  deleteReview 
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { reviewSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getReviewsByProduct);
router.post('/', protect, reviewSchema, createReview);
router.delete('/:id', protect, deleteReview);

export default router;
