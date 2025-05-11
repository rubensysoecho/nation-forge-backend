import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI, Type } from "@google/genai";
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
import {
    nationSchema,
    warSchema,
    politicsSchema,
    economySchema,
    populationSchema
} from "../helpers/jsonSchemas.js";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });

// Esta función la mantenemos para casos en los que no usemos structured output
function cleanJsonResponse(text) {
    console.log("🧹 Limpiando respuesta JSON...");
    // Eliminar bloques de código markdown
    let cleaned = text.replace(/```(json)?|```/g, '');
    cleaned = cleaned.trim();
    
    // Reemplazar comillas especiales por comillas dobles estándar
    cleaned = cleaned.replace(/[""]/g, '"');
    
    // Eliminar comas finales en arrays y objetos (trailing commas)
    cleaned = cleaned.replace(/,(\s*[\]}])/g, '$1');
    
    // Manejar caracteres de escape en strings
    cleaned = cleaned.replace(/\\\\"/g, '\\"');
    
    // Manejar caracteres de nueva línea no escapados dentro de strings
    cleaned = cleaned.replace(/([":]\s*"[^"]*?)[\n\r]+([^"]*?")/g, '$1\\n$2');
    
    try {
        // Intentar parsear para verificar si es válido
        JSON.parse(cleaned);
        console.log("✅ JSON parseado correctamente en primer intento");
        return cleaned;
    } catch (error) {
        console.error("❌ Error al parsear JSON limpiado:", error.message);
        // Añadir lógica de recuperación para casos específicos
        
        // Contador para evitar bucles infinitos
        let attempts = 0;
        const maxAttempts = 5;
        let lastError = error;
        
        while (attempts < maxAttempts) {
            attempts++;
            console.log(`🔄 Intento de reparación ${attempts}/${maxAttempts}`);
            
            try {
                // Si el error es una cadena no terminada
                if (error.message.includes("Unterminated string")) {
                    // Buscar la posición del error
                    if (error.message.includes("position")) {
                        const position = parseInt(error.message.match(/position (\d+)/)[1]);
                        console.log(`Reparando cadena no terminada en posición ${position}`);
                        
                        // Buscar la última comilla antes de la posición del error
                        let lastQuotePos = -1;
                        for (let i = position; i >= 0; i--) {
                            if (cleaned[i] === '"' && (i === 0 || cleaned[i - 1] !== '\\')) {
                                lastQuotePos = i;
                                break;
                            }
                        }
                        
                        if (lastQuotePos !== -1) {
                            // Cerrar la cadena insertando una comilla
                            cleaned = cleaned.substring(0, position) + '"' + cleaned.substring(position);
                            console.log(`Cadena cerrada en posición ${position}`);
                        }
                    }
                }
                
                // Si el error es sobre una posición específica
                if (error.message.includes("position")) {
                    const position = parseInt(error.message.match(/position (\d+)/)[1]);
                    console.log(`Intentando reparar JSON en posición ${position}`);
                    
                    // Buscar comillas sin escapar dentro de strings cerca de la posición del error
                    const before = cleaned.substring(Math.max(0, position - 50), position);
                    const after = cleaned.substring(position, Math.min(cleaned.length, position + 50));
                    console.log(`Contexto alrededor del error: "${before}<<<ERROR>>>${after}"`);
                    
                    // Escapar comillas dentro de strings
                    let segment = cleaned.substring(Math.max(0, position - 100), Math.min(cleaned.length, position + 100));
                    if (segment.includes('"')) {
                        // Encontrar la posición de la última cita de apertura antes del error
                        let inString = false;
                        let escapedSegment = '';
                        for (let i = 0; i < segment.length; i++) {
                            let c = segment[i];
                            
                            // Si encontramos una comilla no escapada
                            if (c === '"' && (i === 0 || segment[i - 1] !== '\\')) {
                                inString = !inString;
                            } 
                            
                            // Si estamos dentro de una cadena y encontramos una comilla sin escapar que no es la comilla de cierre
                            if (inString && c === '"' && i > 0 && segment[i - 1] !== '\\' && i < segment.length - 1) {
                                escapedSegment += '\\';
                            }
                            
                            escapedSegment += c;
                        }
                        
                        // Reemplazar el segmento
                        cleaned = cleaned.substring(0, Math.max(0, position - 100)) + 
                                escapedSegment + 
                                cleaned.substring(Math.min(cleaned.length, position + 100));
                    }
                }
                
                // Intentar parsear de nuevo
                JSON.parse(cleaned);
                console.log(`Reparación exitosa en el intento ${attempts}`);
                return cleaned;
            } catch (newError) {
                // Almacenar el nuevo error para el próximo intento
                lastError = newError;
                console.error(`Intento ${attempts} falló: ${newError.message}`);
            }
        }
        
        console.warn(`No se pudo reparar después de ${maxAttempts} intentos. Aplicando limpieza de emergencia.`);
        
        // Último recurso: limpieza agresiva
        // 1. Eliminar caracteres de control
        cleaned = cleaned.replace(/[\u0000-\u001F]+/g, "");
        
        // 2. Intentar cerrar todas las cadenas no terminadas
        let inString = false;
        let balance = 0;
        let newCleaned = '';
        
        for (let i = 0; i < cleaned.length; i++) {
            const char = cleaned[i];
            newCleaned += char;
            
            // Comprobar comillas
            if (char === '"' && (i === 0 || cleaned[i - 1] !== '\\')) {
                inString = !inString;
            }
        }
        
        // Si quedamos dentro de una cadena al final, cerrarla
        if (inString) {
            newCleaned += '"';
        }
        
        cleaned = newCleaned;
        
        // 3. Equilibrar corchetes y llaves
        try {
            JSON.parse(cleaned);
            return cleaned;
        } catch (finalError) {
            console.error(`Limpieza de emergencia falló: ${finalError.message}`);
            throw new Error(`No se pudo reparar el JSON después de múltiples intentos: ${finalError.message}`);
        }
    }
}

async function generateNationGemini(nationConcept, governmentType, age, optionalPrompt) {
    console.log(`🧠 [Gemini] Iniciando generación de nación básica...`);
    console.log(`🧠 [Gemini] Parámetros: ${nationConcept}, ${governmentType}, ${age}`);
    
    const prompt = nationPromptTemplate
        .replace('{{nationConcept}}', nationConcept)
        .replace('{{governmentType}}', governmentType)
        .replace('{{age}}', age);

    const chat = genAI.chats.create({
        model: "gemini-2.0-flash",
        config: {
            ...generationConfig,
            systemInstruction: nationSystemInstruction,
        },
    });

    console.log(`🧠 [Gemini] Generando información básica de la nación...`);
    const result1 = await chat.sendMessage({
        message: prompt,
    })
    const json1 = JSON.parse(cleanJsonResponse(result1.text));
    console.log(`✅ [Gemini] Información básica generada: ${json1.name}`);

    console.log(`🧠 [Gemini] Generando detalles políticos...`);
    const result2 = await chat.sendMessage({
        message: politicsDetailsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: politicsSchema
        }
    })
    const json2 = JSON.parse(cleanJsonResponse(result2.text));
    console.log(`✅ [Gemini] Detalles políticos generados: ${json2.governmentType}`);

    console.log(`🧠 [Gemini] Generando detalles económicos...`);
    const result3 = await chat.sendMessage({
        message: economicDetailsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: economySchema
        }
    })
    const json3 = JSON.parse(cleanJsonResponse(result3.text));
    console.log(`✅ [Gemini] Detalles económicos generados: Sistema ${json3.economicSystem}`);

    console.log(`🧠 [Gemini] Generando detalles demográficos...`);
    const result4 = await chat.sendMessage({
        message: populationDetailsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: populationSchema
        }
    })
    const json4 = JSON.parse(cleanJsonResponse(result4.text));
    console.log(`✅ [Gemini] Detalles demográficos generados: Población ${json4.populationSize}`);

    json1.politicsDetails = json2;
    json1.economyDetails = json3;
    json1.populationDetails = json4;
    
    console.log(`🧠 [Gemini] Ensamblando JSON completo de la nación...`);
    let updatedJsonStr = JSON.stringify(json1, null, 2);
    console.log(`✅ [Gemini] Generación de nación básica completada`);
    return updatedJsonStr;
}

async function generateNationAdvancedGemini(nationConcept, governmentType, age, leaderName, politicalStability, economicSystem, currencyName, wealthDistribution, lifeExpectancy, populationGrowth, other) {
    console.log(`🧠 [Gemini] Iniciando generación de nación avanzada...`);
    console.log(`🧠 [Gemini] Parámetros principales: ${nationConcept}, ${governmentType}, ${age}`);
    console.log(`🧠 [Gemini] Parámetros adicionales: Líder=${leaderName}, Estabilidad=${politicalStability}, Economía=${economicSystem}`);
    
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

    // Detalles básicos usando structured output
    console.log(`🧠 [Gemini] Generando información básica de la nación avanzada...`);

    const chat = genAI.chats.create({
        model: "gemini-2.0-flash",
        config: {
            ...generationConfig,
            systemInstruction: nationSystemInstructionAdvanced,
        },
    });

    const result1 = await chat.sendMessage({
        message: prompt,
    })
    const json1 = JSON.parse(cleanJsonResponse(result1.text));

    console.log(`✅ [Gemini] Información básica avanzada generada: ${json1.name}`);

    // Política usando structured output
    console.log(`🧠 [Gemini] Generando detalles políticos avanzados...`);
    const result2 = await chat.sendMessage({
        message: politicsDetailsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: politicsSchema
        }
    });
    const json2 = JSON.parse(cleanJsonResponse(result2.text));
   console.log(`✅ [Gemini] Detalles políticos avanzados generados: ${json2.governmentType}`);

    // Economía usando structured output
    console.log(`🧠 [Gemini] Generando detalles económicos avanzados...`);
    const result3 = await chat.sendMessage({
        message: economicDetailsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: economySchema
        }
    });
    const json3 = JSON.parse(cleanJsonResponse(result3.text));
    console.log(`✅ [Gemini] Detalles económicos avanzados generados: Sistema ${json3.economicSystem}, Moneda: ${json3.currencyName}`);

    // Demografía usando structured output
    console.log(`🧠 [Gemini] Generando detalles demográficos avanzados...`);
    const result4 = await chat.sendMessage({
        message: populationDetailsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: populationSchema
        }
    });
    const json4 = JSON.parse(cleanJsonResponse(result4.text));
    console.log(`✅ [Gemini] Detalles demográficos avanzados generados: Población ${json4.populationSize}, Esperanza de vida: ${json4.lifeExpectancy}`);

    json1.politicsDetails = json2;
    json1.economyDetails = json3;
    json1.populationDetails = json4;

    console.log(`🧠 [Gemini] Ensamblando JSON completo de la nación avanzada...`);
    let updatedJsonStr = JSON.stringify(json1, null, 2);
    console.log(`✅ [Gemini] Generación de nación avanzada completada`);
    return updatedJsonStr;
}

async function generateNationRandomGemini() {
    console.log(`🧠 [Gemini] Iniciando generación de nación aleatoria...`);
    console.log(`🧠 [Gemini] Usando plantilla para generación aleatoria`);
    
    const prompt = nationRandomPromptTemplate;

    // Detalles básicos usando structured output
    console.log(`🧠 [Gemini] Generando información básica aleatoria...`);
    const chat = genAI.chats.create({
        model: "gemini-2.0-flash",
        config: {
            ...generationConfig,
            systemInstruction: nationRandomPromptTemplate,
        },
    });

    const result1 = await chat.sendMessage({
        message: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: nationSchema
        }
    })
    const json1 = JSON.parse(cleanJsonResponse(result1.text));

   console.log(`✅ [Gemini] Información básica aleatoria generada: ${json1.name}`);
   console.log(`🎲 [Gemini] Contexto histórico aleatorio generado de ${json1.historicalContext.length} caracteres`);

    // Política usando structured output
    console.log(`🧠 [Gemini] Generando detalles políticos aleatorios...`);
    const result2 = await chat.sendMessage({
        message: politicsDetailsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: politicsSchema
        }
    });
    const json2 = JSON.parse(cleanJsonResponse(result2.text));
    console.log(`✅ [Gemini] Detalles políticos aleatorios generados: ${json2.governmentType}, Estabilidad: ${json2.politicalStability}`);

    // Economía usando structured output
    console.log(`🧠 [Gemini] Generando detalles económicos aleatorios...`);
    const result3 = await chat.sendMessage({
        message: economicDetailsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: economySchema
        }
    });
    const json3 = JSON.parse(cleanJsonResponse(result3.text));
    console.log(`✅ [Gemini] Detalles económicos aleatorios generados: Sistema ${json3.economicSystem}, Moneda: ${json3.currencyName}`);

    // Demografía usando structured output
    console.log(`🧠 [Gemini] Generando detalles demográficos aleatorios...`);
    const result4 = await chat.sendMessage({
        message: populationDetailsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: populationSchema
        }
    });
    const json4 = JSON.parse(cleanJsonResponse(result4.text));
    console.log(`✅ [Gemini] Detalles demográficos aleatorios generados: Población ${json4.populationSize}, Crecimiento: ${json4.populationGrowth}`);

    console.log(`🧩 [Gemini] Combinando todas las partes de la nación aleatoria...`);
    json1.politicsDetails = json2;
    json1.economyDetails = json3;
    json1.populationDetails = json4;

    console.log(`🧠 [Gemini] Ensamblando JSON completo de la nación aleatoria...`);
    let updatedJsonStr = JSON.stringify(json1, null, 2);
    console.log(`✅ [Gemini] Generación de nación aleatoria completada`);
    return updatedJsonStr;
}

async function generateWarGemini(nationA, nationB, casusBelli, age, optionalPrompt) {
    const prompt = optionalPrompt || warPromptTemplate
        .replace('{{nationA}}', nationA)
        .replace('{{nationB}}', nationB)
        .replace('{{casusBelli}}', casusBelli)
        .replace('{{age}}', age);

    // Usando structured output
    const result = await warModel.generateContent({
        contents: [
            { role: "user", parts: [{ text: prompt }] }
        ],
        generationConfig: {
            ...generationConfig,
            response_schema: warSchema
        }
    });

    const json = getStructuredResponse(result.response);
    return JSON.stringify(json, null, 2);
}

export { generateNationGemini, generateNationAdvancedGemini, generateNationRandomGemini, generateWarGemini }