import express from 'express';
import { createNation, testNation } from '../controllers/nationController.js';
const router = express.Router();

router.post('/', createNation);
//router.post('/flag', createFlag);
router.get('/', testNation);

export default router;