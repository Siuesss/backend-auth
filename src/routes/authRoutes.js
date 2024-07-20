import express from 'express';
import { registerHandler, loginHandler, logoutHandler, changepasswordHandler } from '../controllers/authController.js';
import { validateRegister, validateLogin, validateLogout, validateChangePassword } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, registerHandler);
router.post('/login', validateLogin, loginHandler);
router.post('/logout', validateLogout,logoutHandler);
router.post('/change/password',validateChangePassword, changepasswordHandler);

export default router;