import express from 'express';
import { createNation, createNationGemini, getNations, getNationsUser } from '../controllers/nationController.js';
const router = express.Router();

router.post('/', createNation);
router.post('/gemini', createNationGemini);
router.get('/', getNations);
router.get('/byuser', getNationsUser);

export default router;