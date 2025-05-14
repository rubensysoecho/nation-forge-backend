import express from 'express';
import { 
    createNationGemini, 
    createRandomNation,
    getNations, 
    getNationsUser, 
    getNationsUserSimple,
    getNationDetails,
    getMonthlyNation,
    addEvent,
    deleteNation,
    updateNation,
    generateImage,
} from '../controllers/nationController.js';

const router = express.Router();

// LEER
router.get('/', getNations);
router.get('/monthly', getMonthlyNation);
router.get('/simple/:userId', getNationsUserSimple);
router.get('/:userId', getNationsUser);
router.get('/details/:nationId', getNationDetails);
router.get('/details/:nationId/generateImage', generateImage);

// CREAR
router.post('/', createNationGemini);
router.post('/random', createRandomNation);
router.post('/:nationId/events', addEvent);

// EDITAR
router.put('/:id', updateNation);

router.delete('/:id', deleteNation);

// router.post('/', createNation);

export default router;