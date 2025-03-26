import Nation from '../models/nation/nationModel.js';
import { Event } from '../models/nation/events/eventModel.js';
import { generateNationGemini } from '../config/gemini.js';

/* const createNation = async (req, res) => {
    try {
        console.log('🌏 Generando nacion - OpenAI ...')
        const nationString = await generateNation(req.body.nationName, req.body.governmentType, req.body.age);
        const nationJSON = JSON.parse(nationString);
        const newNation = new Nation(nationJSON);
        const savedNation = await newNation.save();
        res.send({ msg: "Nation created successfully", nation: savedNation });
    } catch (error) {
        console.log(error);
        res.send(
            { msg: "Error creating nation" }
        );
    }
} */

// METODOS GET
const getNations = async (req, res) => {
    try {
        const nations = await Nation.find(); // Filtra por userId
        res.send(nations);
    } catch (error) {
        console.error(error); // Usa console.error para errores
        res.status(500).send({ msg: "Error retrieving nations", error: error.message }); // Añade el mensaje de error
    }
};
const getNationsUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Obtiene el userId de los query parameters

        if (!userId) {
            return res.status(400).send({ msg: "userId is required in query parameters" });
        }

        const nations = await Nation.find({ creator: userId });
        res.send(nations);
    } catch (error) {
        console.error('❌ Error in getNationsUser:', error);
        res.status(500).send({ msg: "Error retrieving nations", error: error.message });
    }
};

// METODOS POST
const createNationGemini = async (req, res) => {
    try {
        console.log(`🌏 Generando nacion - Gemini ...`)
        const nationString = await generateNationGemini(req.body.nationName, req.body.governmentType, req.body.age);
        const nationJSON = JSON.parse(nationString);
        const newNation = new Nation({
            ...nationJSON,
            creator: req.body.userId
        });
        const savedNation = await newNation.save();
        res.send({ msg: "Nation created successfully", nation: savedNation });
    } catch (error) {
        console.log(error);
        res.send(
            { msg: "Error creating nation" }
        );
    }
}
const addEvent = async (req, res) => {
    try {
        const nationId = req.params.nationId; // Cambiado de req.query.nationId
        const eventData = req.body;

        const nation = await Nation.findById(nationId);

        if (!nation) {
            return res.status(404).json({ message: 'Nación no encontrada' });
        }

        const newEvent = new Event(eventData)
        nation.events.push(newEvent);
        await nation.save();

        res.status(200).json(nation);
    } catch (error) {
        console.error('Error al añadir evento a la nación:', error);
        res.status(500).json({ message: 'Error interno del servidor', error });
    }
}

// METODOS DELETE
const deleteNation = async (req, res) => {
    try {
        const nationId = req.params.id; // Obtener el ID de los parámetros de la URL

        const nation = await Nation.findById(nationId);

        if (!nation) {
            return res.status(404).json({ 
                message: 'Nación no encontrada' 
            });
        }

        // Verificar si el usuario que intenta eliminar es el creador
        if (nation.creator !== req.body.userId) {
            return res.status(403).json({ 
                message: 'No tienes permisos para eliminar esta nación' 
            });
        }

        await Nation.findByIdAndDelete(nationId);

        res.status(200).json({ 
            message: 'Nación eliminada exitosamente' 
        });
    } catch (error) {
        console.error('Error al eliminar la nación:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor', 
            error: error.message 
        });
    }
};

// METODOS PUT
const updateNation = async (req, res) => {
    try {
        const nationId = req.params.id;
        const updates = req.body;

        // Buscar la nación
        const nation = await Nation.findById(nationId);

        if (!nation) {
            return res.status(404).json({ 
                message: 'Nación no encontrada' 
            });
        }

        // Verificar si el usuario que intenta editar es el creador
        if (nation.creator !== updates.userId) {
            return res.status(403).json({ 
                message: 'No tienes permisos para editar esta nación' 
            });
        }

        // Validar campos que se pueden actualizar
        const allowedUpdates = [
            'name',
            'historicalContext',
            'geopoliticalContext',
            'politics',
            'population',
            'historicalCuriosities',
            'importantCharacters'
        ];

        // Filtrar solo los campos permitidos
        const filteredUpdates = Object.keys(updates)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = updates[key];
                return obj;
            }, {});

        // Actualizar la nación
        const updatedNation = await Nation.findByIdAndUpdate(
            nationId,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Nación actualizada exitosamente',
            nation: updatedNation
        });
    } catch (error) {
        console.error('Error al actualizar la nación:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor', 
            error: error.message 
        });
    }
};

export {
    getNations,
    getNationsUser,
    //createNation,
    createNationGemini,
    addEvent,
    deleteNation,
    updateNation
}