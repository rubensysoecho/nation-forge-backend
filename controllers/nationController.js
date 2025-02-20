import Nation from '../models/Nation.js';
import { generateNation } from '../config/openai.js';

const createNation = async (req, res) => {
    try {
        console.log("Generating nation...");
        const nationString = await generateNation(req.body.nation_name, req.body.governmentType, req.body.age);
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

const createFlag = async (req, res) => {
    try {
        const nationFlag = await generateNationFlag(req.body.nation_name, req.body.governmentType, req.body.age);
        res.send(nationFlag);
    } catch (error) {
        console.log(error);
        res.send(
            {msg: "Error creating nation flag"}
        );
    }
}

const testNation = (req, res) => {
    console.log(req.body);
    res.send(
        {
            nation_name: req.body.nation_name,
            historical_context: "req.body.historical_context",
            geopolitical_context: "req.body.geopolitical_context",
            politics: "req.body.politics",
            population: "req.body.population",
            historical_curiosities: "req.body.historical_curiosities",
            important_characters: {
                character1: "peter"
            },
            createdAt: "20/11/2002"
        }
    );
}

export {
    createNation,
    testNation,
}