import express from 'express';
import { createWarGemini, getWars } from '../controllers/nationController.js';
const router = express.Router();

router.post('/', createWarGemini);
router.get('/', getWars);

export default router;