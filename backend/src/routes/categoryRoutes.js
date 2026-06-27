import express from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { categorySchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', getCategories);

// Admin-only category management mutations
router.post('/', protect, admin, categorySchema, createCategory);
router.put('/:id', protect, admin, categorySchema, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
