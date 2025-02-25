import express from 'express';
import { createNation, createNationGemini, getNations } from '../controllers/nationController.js';
const router = express.Router();

router.post('/', createNation);
router.post('/gemini', createNationGemini);
router.get('/', getNations);

export default router;