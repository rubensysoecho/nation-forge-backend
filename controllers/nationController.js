import Nation from '../models/Nation.js';
import War from '../models/War.js';
import { generateNation } from '../config/openai.js';
import { generateNationGemini, generateWarGemini } from '../config/gemini.js';

const createNation = async (req, res) => {
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
}

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

const createWarGemini = async (req, res) => {
    try {
        console.log(`⚔️ Generando conflicto (Peace was never an option...) - Gemini ...`)
        const warString = await generateWarGemini(req.body.nationA, req.body.nationB, req.body.casusBelli, req.body.age, req.body.optionalPrompt);
        const warJSON = JSON.parse(warString);
        const newWar = new War({
            ...warJSON,
            creator: req.body.userId
        });
        const savedWar = await newWar.save();
        res.send({ msg: "War created successfully", war: savedWar });
    } catch (error) {
        console.log(error);
        res.send(
            { msg: "Error creating nation" }
        );
    }
}

const getNations = async (req, res) => {
    try {
        const userId = req.query.userId; // Obtiene el userId de los query parameters

        if (!userId) {
            return res.status(400).send({ msg: "userId is required in query parameters" });
        }

        const nations = await Nation.find({ creator: userId }); // Filtra por userId
        res.send(nations);
    } catch (error) {
        console.error(error); // Usa console.error para errores
        res.status(500).send({ msg: "Error retrieving nations", error: error.message }); // Añade el mensaje de error
    }
};

const getWars = async (req, res) => {
    try {
        const userId = req.query.userId; // Obtiene el userId de los query parameters

        if (!userId) {
            return res.status(400).send({ msg: "userId is required in query parameters" });
        }

        const wars = await War.find({ creator: userId }); // Filtra por userId
        res.send(wars);
    } catch (error) {
        console.error(error); // Usa console.error para errores
        res.status(500).send({ msg: "Error retrieving wars", error: error.message }); // Añade el mensaje de error
    }
};

export {
    getNations,
    createNation,
    createNationGemini,
    getWars,
    createWarGemini,
}