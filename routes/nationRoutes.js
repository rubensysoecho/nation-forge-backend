import express from 'express';
import { 
    createNationGemini, 
    createRandomNation,
    getNations, 
    getNationsUser, 
    getNationsUserSimple,
    getNationDetails,
    addEvent,
    deleteNation,
    updateNation 
} from '../controllers/nationController.js';

const router = express.Router();

// LEER
router.get('/', getNations);
router.get('/simple/:userId', getNationsUserSimple);
router.get('/:userId', getNationsUser);
router.get('/details/:nationId', getNationDetails);

// CREAR
router.post('/', createNationGemini);
router.post('/random', createRandomNation);
router.post('/:nationId/events', addEvent);

// EDITAR
router.put('/:id', updateNation);

router.delete('/:id', deleteNation);

// router.post('/', createNation);

export default router;