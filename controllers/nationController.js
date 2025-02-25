import Nation from '../models/Nation.js';
import { generateNation } from '../config/openai.js';
import { generateNationGemini } from '../config/gemini.js';

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
            {msg: "Error creating nation"}
        );
    }
}

const createNationGemini = async (req, res) => {
    try {
        console.log(`🌏 Generando nacion - Gemini ...`)
        const nationString = await generateNationGemini(req.body.nationName, req.body.governmentType, req.body.age);
        const nationJSON = JSON.parse(nationString);
        const newNation = new Nation(nationJSON);
        const savedNation = await newNation.save();
        res.send({ msg: "Nation created successfully", nation: savedNation });
    } catch (error) {
        console.log(error);
        res.send(
            {msg: "Error creating nation"}
        );
    }
}

const getNations = async (req, res) => {
    try {
        const nations = await Nation.find({});
        res.send(nations);
    } catch (error) {
        console.log(error);
        res.send(
            {msg: "Error retrieving nations"}
        );
    }
}

export {
    createNation,
    createNationGemini,
    getNations,
}