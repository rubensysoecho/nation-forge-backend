import express from 'express';
import { createWarGemini, getWars } from '../controllers/nationController.js';
const router = express.Router();

router.post('/gemini', createWarGemini);
router.get('/', getWars);

export default router;