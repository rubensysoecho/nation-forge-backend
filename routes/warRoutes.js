import express from 'express';
import { createWarGemini, getWars } from '../controllers/warController.js';
const router = express.Router();

router.post('/', createWarGemini);
router.get('/', getWars);

export default router;