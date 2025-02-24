import express from 'express';
import { createNation, getNations } from '../controllers/nationController.js';
const router = express.Router();

router.post('/', createNation);
router.get('/', getNations);

export default router;