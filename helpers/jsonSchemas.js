import { Type } from "@google/genai";

// Esquema para los eventos de una nación
const eventSchema = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING },
    date: { type: Type.STRING },
    title: { type: Type.STRING },
    description: { type: Type.STRING }
  },
  required: ["type", "date", "title", "description"]
};

// Esquema base para una nación
export const nationSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    historicalContext: { type: Type.STRING },
    politics: { type: Type.STRING },
    geopoliticalContext: { type: Type.STRING },
    population: { type: Type.STRING },
    historicalCuriosities: { type: Type.ARRAY, items: { type: Type.STRING } },
    importantCharacters: { type: Type.ARRAY, items: { type: Type.STRING } },
    events: { type: Type.ARRAY, items: eventSchema }
  },
  required: ["name", "historicalContext", "politics", "geopoliticalContext", "population", "historicalCuriosities", "importantCharacters", "events"]
};

// Esquema para guerra
export const warSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    aggressorCountry: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        troops: { type: Type.STRING },
        advantages: { type: Type.ARRAY, items: { type: Type.STRING } },
        disadvantages: { type: Type.ARRAY, items: { type: Type.STRING } },
        equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
        casusBelli: { type: Type.STRING }
      },
      required: ["name", "troops", "advantages", "disadvantages", "equipment", "casusBelli"]
    },
    defenderCountry: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        troops: { type: Type.STRING },
        advantages: { type: Type.ARRAY, items: { type: Type.STRING } },
        disadvantages: { type: Type.ARRAY, items: { type: Type.STRING } },
        equipment: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["name", "troops", "advantages", "disadvantages", "equipment"]
    },
    warProgress: { 
      type: Type.ARRAY, 
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          events: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["day", "events"]
      }
    },
    soldierView: { type: Type.STRING },
    kia: { type: Type.ARRAY, items: { type: Type.STRING } },
    results: { type: Type.STRING },
    winner: { type: Type.STRING }
  },
  required: ["name", "aggressorCountry", "defenderCountry", "warProgress", "soldierView", "kia", "results", "winner"]
};

// Esquema para detalles políticos
export const politicsSchema = {
  type: Type.OBJECT,
  properties: {
    exterior: {
      type: Type.OBJECT,
      properties: {
        geopolitics: {
          type: Type.OBJECT,
          properties: {
            wars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nation: { type: Type.STRING },
                  date: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  outcome: { type: Type.STRING }
                },
                required: ["nation", "date", "reason", "outcome"]
              }
            },
            alliances: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nation: { type: Type.STRING },
                  date: { type: Type.STRING },
                  purpose: { type: Type.STRING }
                },
                required: ["nation", "date", "purpose"]
              }
            }
          },
          required: ["wars", "alliances"]
        },
        influences: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nation: { type: Type.STRING },
              type: { type: Type.STRING },
              strength: { type: Type.STRING }
            },
            required: ["nation", "type", "strength"]
          }
        }
      },
      required: ["geopolitics", "influences"]
    },
    interior: {
      type: Type.OBJECT,
      properties: {
        governmentType: { type: Type.STRING },
        leader: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            rulingParty: { type: Type.STRING },
            succession: { type: Type.STRING }
          },
          required: ["name", "title", "rulingParty", "succession"]
        },
        legislativeBranch: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            structure: { type: Type.STRING },
            powers: { type: Type.STRING }
          },
          required: ["name", "structure", "powers"]
        },
        judicialBranch: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            structure: { type: Type.STRING },
            powers: { type: Type.STRING }
          },
          required: ["name", "structure", "powers"]
        },
        politicalStability: { type: Type.STRING },
        politicalIdeology: { type: Type.STRING },
        separatism: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              region: { type: Type.STRING },
              demands: { type: Type.STRING },
              strength: { type: Type.STRING }
            },
            required: ["region", "demands", "strength"]
          }
        },
        tensions: {
          type: Type.OBJECT,
          properties: {
            cultural: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  group: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  severity: { type: Type.STRING }
                },
                required: ["group", "issue", "severity"]
              }
            },
            religious: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  religion: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  severity: { type: Type.STRING }
                },
                required: ["religion", "issue", "severity"]
              }
            },
            political: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  party: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  severity: { type: Type.STRING }
                },
                required: ["party", "issue", "severity"]
              }
            }
          },
          required: ["cultural", "religious", "political"]
        }
      },
      required: ["governmentType", "leader", "legislativeBranch", "judicialBranch", "politicalStability", "politicalIdeology", "separatism", "tensions"]
    }
  },
  required: ["exterior", "interior"]
};

// Esquema para detalles económicos
export const economySchema = {
  type: Type.OBJECT,
  properties: {
    economicSystem: { type: Type.STRING },
    keySectors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sectorName: { type: Type.STRING },
          importance: { type: Type.STRING }
        },
        required: ["sectorName", "importance"]
      }
    },
    currency: {
      type: Type.OBJECT,
      properties: {
        currencyName: { type: Type.STRING },
        currencySymbol: { type: Type.STRING },
        stability: { type: Type.STRING }
      },
      required: ["currencyName", "currencySymbol", "stability"]
    },
    naturalResources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          resourceName: { type: Type.STRING },
          abundance: { type: Type.STRING }
        },
        required: ["resourceName", "abundance"]
      }
    },
    economicLaw: {
      type: Type.OBJECT,
      properties: {
        propertyRights: { type: Type.STRING },
        contractLaw: { type: Type.STRING },
        taxSystem: { type: Type.STRING },
        regulationLevel: { type: Type.STRING }
      },
      required: ["propertyRights", "contractLaw", "taxSystem", "regulationLevel"]
    },
    tradePolicy: {
      type: Type.OBJECT,
      properties: {
        openness: { type: Type.STRING },
        majorExports: { type: Type.ARRAY, items: { type: Type.STRING } },
        majorImports: { type: Type.ARRAY, items: { type: Type.STRING } },
        tariffs: { type: Type.STRING },
        tradeAgreements: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              partnerNation: { type: Type.STRING },
              agreementType: { type: Type.STRING }
            },
            required: ["partnerNation", "agreementType"]
          }
        }
      },
      required: ["openness", "majorExports", "majorImports", "tariffs", "tradeAgreements"]
    },
    infrastructure: {
      type: Type.OBJECT,
      properties: {
        transportation: { type: Type.STRING },
        energy: { type: Type.STRING },
        communication: { type: Type.STRING }
      },
      required: ["transportation", "energy", "communication"]
    },
    laborForce: {
      type: Type.OBJECT,
      properties: {
        sizeEstimate: { type: Type.STRING },
        skillLevel: { type: Type.STRING },
        unemploymentRate: { type: Type.STRING },
        dominantIndustries: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["sizeEstimate", "skillLevel", "unemploymentRate", "dominantIndustries"]
    },
    wealthDistribution: { type: Type.STRING },
    economicStability: { type: Type.STRING },
    inflationRate: { type: Type.STRING }
  },
  required: [
    "economicSystem", "keySectors", "currency", "naturalResources", 
    "economicLaw", "tradePolicy", "infrastructure", "laborForce", 
    "wealthDistribution", "economicStability", "inflationRate"
  ]
};

// Esquema para detalles demográficos
export const populationSchema = {
  type: Type.OBJECT,
  properties: {
    totalPopulation: { type: Type.STRING },
    growthRate: { type: Type.STRING },
    populationGrowthRate: { type: Type.STRING },
    lifeExpectancy: {
      type: Type.OBJECT,
      properties: {
        male: { type: Type.STRING },
        female: { type: Type.STRING },
        overall: { type: Type.STRING }
      },
      required: ["male", "female", "overall"]
    },
    ethnicGroups: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          percentage: { type: Type.STRING },
          details: { type: Type.STRING },
          // Campos alternativos que pueden aparecer en la respuesta de Gemini
          groupName: { type: Type.STRING },
          notes: { type: Type.STRING }
        },
        required: [] // Se deja vacío para permitir ambos formatos
      }
    },
    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          usage: { type: Type.STRING },
          status: { type: Type.STRING },
          // Campos alternativos que pueden aparecer en la respuesta de Gemini
          languageName: { type: Type.STRING },
          percentageSpeakers: { type: Type.STRING }
        },
        required: [] // Se deja vacío para permitir ambos formatos
      }
    },
    religions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          percentage: { type: Type.STRING },
          influence: { type: Type.STRING },
          // Campos alternativos que pueden aparecer en la respuesta de Gemini
          religionName: { type: Type.STRING },
          percentageAdherents: { type: Type.STRING }
        },
        required: [] // Se deja vacío para permitir ambos formatos
      }
    },
    urbanRuralDivide: {
      type: Type.OBJECT,
      properties: {
        urbanPercentage: { type: Type.STRING },
        ruralPercentage: { type: Type.STRING },
        majorCities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              population: { type: Type.STRING },
              significance: { type: Type.STRING }
            },
            required: ["name", "population", "significance"]
          }
        }
      },
      required: ["urbanPercentage", "ruralPercentage", "majorCities"]
    },
    ageDistribution: {
      type: Type.OBJECT,
      properties: {
        medianAge: { type: Type.STRING },
        ageBrackets: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              bracket: { type: Type.STRING },
              percentage: { type: Type.STRING }
            },
            required: ["bracket", "percentage"]
          }
        },
        dependencyRatio: { type: Type.STRING }
      },
      required: ["medianAge", "ageBrackets", "dependencyRatio"]
    },
    education: {
      type: Type.OBJECT,
      properties: {
        literacyRate: { type: Type.STRING },
        educationSystem: { type: Type.STRING },
        educationalInstitutions: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        educationLevel: { type: Type.STRING }
      },
      required: ["literacyRate", "educationSystem", "educationalInstitutions"]
    },
    healthCare: {
      type: Type.OBJECT,
      properties: {
        qualityLevel: { type: Type.STRING },
        accessLevel: { type: Type.STRING },
        majorChallenges: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        infantMortalityRate: { type: Type.STRING },
        accessToHealthcare: { type: Type.STRING }
      },
      required: ["qualityLevel", "accessLevel", "majorChallenges"]
    },
    migration: {
      type: Type.OBJECT,
      properties: {
        immigrationRate: { type: Type.STRING },
        emigrationRate: { type: Type.STRING },
        mainOriginsDestinations: { type: Type.STRING }
      },
      required: ["immigrationRate", "emigrationRate", "mainOriginsDestinations"]
    },
    workforceDistribution: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sector: { type: Type.STRING },
          percentage: { type: Type.STRING },
          dominantProfessions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["sector", "percentage", "dominantProfessions"]
      }
    },
    socialClasses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          percentage: { type: Type.STRING },
          economicStatus: { type: Type.STRING },
          politicalInfluence: { type: Type.STRING }
        },
        required: ["name", "percentage", "economicStatus", "politicalInfluence"]
      }
    }
  },
  required: [
    "totalPopulation", "ethnicGroups", "languages", "religions",
    "urbanRuralDivide", "education", "healthCare", "socialClasses"
  ]
};