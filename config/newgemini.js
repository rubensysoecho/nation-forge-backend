import { GoogleGenAI } from "@google/genai";
import {
  nationPromptTemplate,
  nationAdvancedPromptTemplate,
  nationSystemInstruction,
  economicDetailsPrompt,
  politicsDetailsPrompt,
  populationDetailsPrompt,
} from "../helpers/newGeminiInstructions.js";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });
const geminiModel = "gemini-3-flash-preview";

const masterNationSchema = {
  description:
    "Esquema integral que fusiona historia, política, economía y demografía de una nación.",
  type: "object",
  properties: {
    // --- INFORMACIÓN BÁSICA E HISTÓRICA ---
    name: {
      type: "string",
      description: "Nombre oficial (ej: República de..., Imperio de...).",
    },
    historicalContext: {
      type: "string",
      description: "Origen y evolución histórica hasta el año actual.",
    },
    geopoliticalContext: {
      type: "string",
      description: "Posición mundial y relaciones generales con vecinos.",
    },
    historicalCuriosities: { type: "array", items: { type: "string" } },
    importantCharacters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          role: {
            type: "string",
            description: "Ej: General, Filósofo, Líder Rebelde.",
          },
          description: { type: "string" },
        },
      },
    },
    events: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: [
              "foundation",
              "war",
              "treaty",
              "revolution",
              "disaster",
              "plague",
              "other",
            ],
          },
          date: {
            type: "string",
            description: "Formato ISO 8601 o año relevante.",
          },
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["type", "date", "title", "description"],
      },
    },

    // --- POLÍTICA (Interior y Exterior) ---
    politics: {
      type: "object",
      properties: {
        governmentSystem: {
          type: "string",
          description: "Tipo de gobierno y estructura de poderes.",
        },
        leadership: {
          type: "object",
          properties: {
            currentLeader: { type: "string" },
            title: { type: "string" },
            succession: { type: "string" },
          },
        },
        foreignPolicy: {
          type: "object",
          properties: {
            alliances: { type: "array", items: { type: "string" } },
            activeConflicts: { type: "array", items: { type: "string" } },
            sphereOfInfluence: {
              type: "string",
              enum: ["high", "medium", "low"],
            },
          },
        },
        internalStability: {
          type: "object",
          properties: {
            stabilityLevel: {
              type: "string",
              enum: ["volatile", "low", "medium", "high"],
            },
            tensions: {
              type: "array",
              items: { type: "string" },
              description:
                "Conflictos culturales, religiosos o políticos internos.",
            },
          },
        },
      },
      required: ["governmentSystem", "leadership", "internalStability"],
    },

    // --- ECONOMÍA ---
    economy: {
      type: "object",
      properties: {
        system: {
          type: "string",
          description:
            "Ej: Capitalismo de mercado, Feudalismo, Economía planificada.",
        },
        currency: {
          type: "object",
          properties: {
            name: { type: "string" },
            symbol: { type: "string" },
            stability: { type: "string" },
          },
        },
        sectors: {
          type: "array",
          items: { type: "string" },
          description: "Sectores dominantes (ej: Minería, Tecnología).",
        },
        naturalResources: { type: "array", items: { type: "string" } },
        tradePolicy: {
          type: "string",
          description: "Nivel de apertura y principales exportaciones.",
        },
        wealthDistribution: {
          type: "string",
          enum: ["equal", "moderate", "unequal", "extreme_inequality"],
        },
      },
      required: ["system", "currency", "sectors"],
    },

    // --- DEMOGRAFÍA Y SOCIEDAD ---
    demographics: {
      type: "object",
      properties: {
        totalPopulation: { type: "string" },
        ethnicGroups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              group: { type: "string" },
              percentage: { type: "string" },
            },
          },
        },
        languages: { type: "array", items: { type: "string" } },
        religions: { type: "array", items: { type: "string" } },
        qualityOfLife: {
          type: "object",
          properties: {
            lifeExpectancy: { type: "string" },
            literacyRate: { type: "string" },
            urbanization: {
              type: "string",
              description: "Porcentaje de población en ciudades.",
            },
          },
        },
      },
      required: ["totalPopulation", "ethnicGroups", "qualityOfLife"],
    },
  },
  required: [
    "name",
    "historicalContext",
    "geopoliticalContext",
    "events",
    "politics",
    "economy",
    "demographics",
  ],
};

const nationSchema = {
  description: "Esquema completo para la generación de una nación detallada",
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "El nombre oficial de la nación.",
    },
    historicalContext: {
      type: "string",
      description: "Resumen de la historia y origen de la nación.",
    },
    politics: {
      type: "string",
      description: "Descripción del sistema de gobierno y clima político.",
    },
    geopoliticalContext: {
      type: "string",
      description:
        "Relación de la nación con sus vecinos y su posición en el mundo.",
    },
    population: {
      type: "string",
      description: "Detalles sobre la demografía y sociedad.",
    },
    historicalCuriosities: {
      type: "array",
      items: { type: "string" },
      description: "Lista de datos curiosos o hechos poco conocidos.",
    },
    importantCharacters: {
      type: "array",
      items: { type: "string" },
      description: "Nombres y roles de figuras históricas clave.",
    },
    events: {
      type: "array",
      description: "Línea de tiempo de eventos significativos.",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description:
              "Categoría del evento (ej: 'foundation', 'war', 'treaty').",
          },
          date: {
            type: "string",
            description: "Fecha en formato ISO 8601 ($YYYY-MM-DD$).",
          },
          title: {
            type: "string",
            description: "Nombre del evento.",
          },
          description: {
            type: "string",
            description: "Explicación detallada de lo que ocurrió.",
          },
        },
        required: ["type", "date", "title", "description"],
      },
    },
  },
  required: [
    "name",
    "historicalContext",
    "politics",
    "geopoliticalContext",
    "population",
    "historicalCuriosities",
    "importantCharacters",
    "events",
  ],
};

const generationConfig1 = {
  temperature: 0.35,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  _responseJsonSchema: nationSchema,
  systemInstruction: nationSystemInstruction,
};

const generationConfig = {
  temperature: 0.35,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  _responseJsonSchema: masterNationSchema,
  systemInstruction: nationSystemInstruction.concat(
    economicDetailsPrompt.concat(
      politicsDetailsPrompt.concat(populationDetailsPrompt),
    ),
  ),
};

export async function generateNation(nationConcept, governmentType, age) {
  console.log(`🧠 Iniciando generación de nación...`);
  const response = await genAI.models.generateContent({
    model: geminiModel,
    config: generationConfig,
    contents: nationPromptTemplate
      .replace("{{nationConcept}}", nationConcept || "Aleatoria")
      .replace("{{governmentType}}", governmentType || "Aleatorio")
      .replace("{{age}}", age || "Aleatoria"),
  });
  return response.text;
}

export async function generateNationAdvanced(
  nationConcept,
  governmentType,
  age,
  leaderName,
  politicalStability,
  economicSystem,
  currencyName,
  wealthDistribution,
  lifeExpectancy,
  populationGrowth,
  other,
) {
  console.log(`🧠 Iniciando generación de nación avanzada...`);
  const response = await genAI.models.generateContent({
    model: geminiModel,
    config: generationConfig,
    contents: nationAdvancedPromptTemplate
      .replace("{{nationConcept}}", nationConcept || "Aleatoria")
      .replace("{{governmentType}}", governmentType || "Aleatorio")
      .replace("{{age}}", age || "Aleatoria")
      .replace("{{leaderName}}", leaderName || "Aleatoria")
      .replace("{{politicalStability}}", politicalStability || "Aleatoria")
      .replace("{{economicSystem}}", economicSystem || "Aleatoria")
      .replace("{{currencyName}}", currencyName || "Aleatoria")
      .replace("{{wealthDistribution}}", wealthDistribution || "Aleatoria")
      .replace("{{lifeExpectancy}}", lifeExpectancy || "Aleatoria")
      .replace("{{populationGrowth}}", populationGrowth || "Aleatoria")
      .replace("{{other}}", other || "Aleatoria"),
  });
  return response.text;
}
