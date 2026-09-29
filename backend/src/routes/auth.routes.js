import { Router } from 'express';

import {
  register,
  login,
  logout,
  me,
} from '../controllers/auth.controller.js';

import {
  registerValidator,
  loginValidator,
} from '../validators/auth.validator.js';

import validate from '../middlewares/validate.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

// --- Public routes ---
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', logout); // no auth needed — just clears cookie

// --- Protected routes ---
router.get('/me', authMiddleware, me);

export default router;