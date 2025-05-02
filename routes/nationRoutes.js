import express from 'express';
import { 
    createNationGemini, 
    createRandomNation,
    getNations, 
    getNationsUser, 
    addEvent,
    deleteNation,
    updateNation 
} from '../controllers/nationController.js';

const router = express.Router();

// LEER
router.get('/', getNations);
router.get('/:userId', getNationsUser);

// CREAR
router.post('/', createNationGemini);
router.post('/random', createRandomNation);
router.post('/:nationId/events', addEvent);

// EDITAR
router.put('/:id', updateNation);

router.delete('/:id', deleteNation);

// router.post('/', createNation);

export default router;