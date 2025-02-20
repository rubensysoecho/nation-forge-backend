import express from 'express';
import { createUser, verifyUser, userDetails } from '../controllers/userController.js';
const router = express.Router();

router.post('/', createUser);
router.get('/profile', userDetails);
router.get('/verify/:token', verifyUser)

export default router;