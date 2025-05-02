import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  nationSystemInstruction,
  nationSystemInstructionAdvanced,
  warSystemInstruction,
  politicsDetailsPrompt,
  economicDetailsPrompt,
  populationDetailsPrompt,
  generationConfig,
  nationPromptTemplate,
  nationAdvancedPromptTemplate,
  nationRandomPromptTemplate,
  warPromptTemplate
} from "../helpers/geminiInstructions.js";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Función para limpiar y validar respuestas JSON de Gemini
function cleanJsonResponse(text) {
  // Eliminar bloques de código markdown
  let cleaned = text.replace(/```(json)?|```/g, '');
  // Eliminar espacios en blanco al principio y al final
  cleaned = cleaned.trim();
  // Reemplazar comillas incorrectas si existen
  cleaned = cleaned.replace(/[""]/g, '"');
  // Asegurar que no haya comas después del último elemento en arreglos u objetos
  cleaned = cleaned.replace(/,(\s*[\]}])/g, '$1');
  
  return cleaned;
}

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

    // Detalles básicos
    const result1 = await chatSession.sendMessage(prompt);
    const responseText1 = cleanJsonResponse(result1.response.text());
    const json1 = JSON.parse(responseText1);

    // Politica
    const result2 = await chatSession.sendMessage(politicsDetailsPrompt);
    const responseText2 = cleanJsonResponse(result2.response.text());
    const json2 = JSON.parse(responseText2);

    // Economía
    const result3 = await chatSession.sendMessage(economicDetailsPrompt);
    const responseText3 = cleanJsonResponse(result3.response.text());
    const json3 = JSON.parse(responseText3);

    // Demografia
    const result4 = await chatSession.sendMessage(populationDetailsPrompt);
    const responseText4 = cleanJsonResponse(result4.response.text());
    const json4 = JSON.parse(responseText4);

    json1.politicsDetails = json2
    json1.economyDetails = json3
    json1.populationDetails = json4

    let updatedJsonStr = JSON.stringify(json1, null, 2)
    return updatedJsonStr
}

async function generateNationAdvancedGemini(nationConcept, governmentType, age, leaderName, politicalStability, economicSystem, currencyName, wealthDistribution, lifeExpectancy, populationGrowth, other) {
    const chatSession = nationModel.startChat({
        generationConfig,
    });

    const prompt = nationAdvancedPromptTemplate
        .replace('{{nationConcept}}', nationConcept)
        .replace('{{governmentType}}', governmentType)
        .replace('{{age}}', age)
        .replace('{{leaderName}}', leaderName)
        .replace('{{politicalStability}}', politicalStability)
        .replace('{{economicSystem}}', economicSystem)
        .replace('{{currencyName}}', currencyName)
        .replace('{{wealthDistribution}}', wealthDistribution)
        .replace('{{lifeExpectancy}}', lifeExpectancy)
        .replace('{{populationGrowth}}', populationGrowth)
        .replace('{{other}}', other);

    // Detalles básicos
    const result1 = await chatSession.sendMessage(prompt);
    const responseText1 = cleanJsonResponse(result1.response.text());
    const json1 = JSON.parse(responseText1);

    // Politica
    const result2 = await chatSession.sendMessage(politicsDetailsPrompt);
    const responseText2 = cleanJsonResponse(result2.response.text());
    const json2 = JSON.parse(responseText2);

    // Economía
    const result3 = await chatSession.sendMessage(economicDetailsPrompt);
    const responseText3 = cleanJsonResponse(result3.response.text());
    const json3 = JSON.parse(responseText3);

    // Demografia
    const result4 = await chatSession.sendMessage(populationDetailsPrompt);
    const responseText4 = cleanJsonResponse(result4.response.text());
    const json4 = JSON.parse(responseText4);

    json1.politicsDetails = json2
    json1.economyDetails = json3
    json1.populationDetails = json4

    let updatedJsonStr = JSON.stringify(json1, null, 2)
    return updatedJsonStr
}

async function generateNationRandomGemini() {
    const chatSession = nationModel.startChat({
        generationConfig,
    });

    const prompt = nationRandomPromptTemplate

    // Detalles básicos
    const result1 = await chatSession.sendMessage(prompt);
    const responseText1 = cleanJsonResponse(result1.response.text());
    const json1 = JSON.parse(responseText1);

    // Politica
    const result2 = await chatSession.sendMessage(politicsDetailsPrompt);
    const responseText2 = cleanJsonResponse(result2.response.text());
    const json2 = JSON.parse(responseText2);

    // Economía
    const result3 = await chatSession.sendMessage(economicDetailsPrompt);
    const responseText3 = cleanJsonResponse(result3.response.text());
    const json3 = JSON.parse(responseText3);

    // Demografia
    const result4 = await chatSession.sendMessage(populationDetailsPrompt);
    const responseText4 = cleanJsonResponse(result4.response.text());
    const json4 = JSON.parse(responseText4);

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
    const responseText = cleanJsonResponse(result.response.text());
    return responseText
}

export { generateNationGemini, generateNationAdvancedGemini, generateNationRandomGemini, generateWarGemini }