import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductsMeta
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { productSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/meta', getProductsMeta);
router.get('/:id', getProductById);

// Admin-protected routes
router.post('/', protect, admin, productSchema, createProduct);
router.put('/:id', protect, admin, productSchema, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
