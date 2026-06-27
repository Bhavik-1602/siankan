import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  getAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { profileSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/profile/:userId', protect, getProfile);
router.put('/profile/:userId', protect, profileSchema, updateProfile);

// Address Management
router.get('/addresses/:userId', protect, getAddresses);
router.post('/addresses', protect, createAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

export default router;

