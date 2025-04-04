import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  nationSystemInstruction,
  warSystemInstruction,
  politicsDetailsPrompt,
  economicDetailsPrompt,
  populationDetailsPrompt,
  generationConfig,
  nationPromptTemplate,
  warPromptTemplate
} from "../helpers/geminiInstructions.js";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const nationModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: nationSystemInstruction
});

const warModel = genAI.getGenerativeModel({
    model: "gemini-2.0-pro-exp-02-05",
    systemInstruction: warSystemInstruction
});

async function generateNationGemini(nationConcept, governmentType, age, optionalPrompt) {
    const chatSession = nationModel.startChat({
        generationConfig,
    });

    const prompt = optionalPrompt || nationPromptTemplate
        .replace('{{nationConcept}}', nationConcept)
        .replace('{{governmentType}}', governmentType)
        .replace('{{age}}', age);

    const result1 = await chatSession.sendMessage(prompt);
    const responseText1 = result1.response.text().replace(/```(json)?/g, '').trim();
    const json1 = JSON.parse(responseText1)

    // Politica
    const result2 = await chatSession.sendMessage(politicsDetailsPrompt)
    const responseText2 = result2.response.text().replace(/```(json)?/g, '').trim();
    const json2 = JSON.parse(responseText2)

    // Economía
    const result3 = await chatSession.sendMessage(economicDetailsPrompt)
    const responseText3 = result3.response.text().replace(/```(json)?/g, '').trim();
    const json3 = JSON.parse(responseText3)

    // Demografia
    const result4 = await chatSession.sendMessage(populationDetailsPrompt)
    const responseText4 = result4.response.text().replace(/```(json)?/g, '').trim();
    const json4 = JSON.parse(responseText4)

    json1.politicsDetails = json2
    json1.economyDetails = json3
    json1.populationDetails = json4

    let updatedJsonStr = JSON.stringify(json1, null, 2)
    return updatedJsonStr
}

async function generateWarGemini(nationA, nationB, casusBelli, age, optionalPrompt) {
    const chatSession = warModel.startChat({
        generationConfig,
    });

    const prompt = optionalPrompt || warPromptTemplate
        .replace('{{nationA}}', nationA)
        .replace('{{nationB}}', nationB)
        .replace('{{casusBelli}}', casusBelli)
        .replace('{{age}}', age);

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text().replace(/```(json)?/g, '').trim();
    return responseText
}

export { generateNationGemini, generateWarGemini }