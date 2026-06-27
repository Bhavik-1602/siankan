import express from 'express';
import { 
  getBanners, 
  createBanner, 
  updateBanner, 
  deleteBanner 
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { bannerSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', getBanners);

// Admin-only banner management
router.post('/', protect, admin, bannerSchema, createBanner);
router.put('/:id', protect, admin, bannerSchema, updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

export default router;
