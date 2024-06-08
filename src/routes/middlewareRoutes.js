import express from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', requireAdmin, (req, res) => {
  res.status(200).json({ message: 'Welcome, Admin!' });
});

export default router;