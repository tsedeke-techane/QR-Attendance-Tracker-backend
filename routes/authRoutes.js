import { Router } from 'express';
const router = Router();
import { register, login, logout } from '../controllers/authControllers.js';

router.post('/register' , register);
router.post('/login' , login);
router.post('/logout' , logout);
// router.post('/forgot-password' , forgotPassword);


export default router;