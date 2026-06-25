import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import { signupSchema, loginSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/signup', signupSchema, signup);
router.post('/login', loginSchema, login);
router.post('/logout', logout);

export default router;
