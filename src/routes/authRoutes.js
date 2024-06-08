import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { checkSessionMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', checkSessionMiddleware, register);
router.post('/login', checkSessionMiddleware, login);
router.post('/logout', logout);

export default router;