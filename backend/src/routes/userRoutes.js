import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { profileSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/profile/:userId', protect, getProfile);
router.put('/profile/:userId', protect, profileSchema, updateProfile);

export default router;
