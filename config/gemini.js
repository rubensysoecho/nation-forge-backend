import { GoogleGenAI, Type } from "@google/genai";
import {
  nationSystemInstruction,
  warSystemInstruction,
} from "../helpers/geminiInstructions.js";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });
const geminiModel = "gemini-2.5-flash";

const warSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description:
        "Nombre histórico coherente (ej. 2ª Guerra de Secesión, Operación Alhambra)",
    },
    year: { type: Type.NUMBER },
    casusBelli: { type: Type.STRING },

    // FASE II: INVESTIGACIÓN - AGRESOR
    aggressorCountry: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        totalTroops: {
          type: Type.NUMBER,
          description:
            "Número total de efectivos movilizados (personal activo y reserva)",
        },
        militaryStructure: {
          type: Type.STRING,
          description:
            "Organización de las fuerzas, doctrina militar y principales proveedores",
        },
        budget: {
          type: Type.STRING,
          description: "Presupuesto de defensa en USD y porcentaje del PIB",
        },
        inventory: {
          type: Type.OBJECT,
          properties: {
            army: {
              type: Type.STRING,
              description:
                "Modelos y cantidades de tanques, blindados y artillería",
            },
            navy: {
              type: Type.STRING,
              description: "Buques, submarinos y capacidades de patrulla",
            },
            airForce: {
              type: Type.STRING,
              description:
                "Cazas, bombarderos, helicópteros y drones de combate",
            },
            specialCapacities: {
              type: Type.STRING,
              description:
                "Cibernética, satélites y armamento nuclear/estratégico",
            },
          },
          required: ["army", "navy", "airForce"],
        },
        geography: {
          type: Type.STRING,
          description:
            "Fronteras, terreno (montañas, ríos) e infraestructura clave",
        },
        economy: {
          type: Type.STRING,
          description:
            "PIB, industrias principales y dependencia de importaciones (energía/comida)",
        },
        moralAndSupport: {
          type: Type.NUMBER,
          description:
            "Nivel de moral de las tropas y apoyo popular a la guerra (0-100)",
        },
      },
      required: [
        "name",
        "totalTroops",
        "militaryStructure",
        "inventory",
        "geography",
        "economy",
      ],
    },

    // FASE II: INVESTIGACIÓN - DEFENSOR (Espejo del agresor)
    defenderCountry: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        totalTroops: { type: Type.NUMBER },
        militaryStructure: { type: Type.STRING },
        budget: { type: Type.STRING },
        inventory: {
          type: Type.OBJECT,
          properties: {
            army: { type: Type.STRING },
            navy: { type: Type.STRING },
            airForce: { type: Type.STRING },
            specialCapacities: { type: Type.STRING },
          },
          required: ["army", "navy", "airForce"],
        },
        geography: { type: Type.STRING },
        economy: { type: Type.STRING },
        moralAndSupport: { type: Type.NUMBER },
      },
      required: [
        "name",
        "totalTroops",
        "militaryStructure",
        "inventory",
        "geography",
        "economy",
      ],
    },

    // FASE III Y IV: DESARROLLO Y EJECUCIÓN
    warProgress: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: {
            type: Type.STRING,
            description:
              "Nombre de la fase (ej: Ofensiva inicial, Desgaste en el frente)",
          },
          chronology: {
            type: Type.STRING,
            description:
              "Descripción detallada de los eventos clave día a día o semana a semana",
          },
          importantBattles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                location: {
                  type: Type.STRING,
                  description: "Ubicación geográfica exacta o estratégica",
                },
                forcesInvolved: {
                  type: Type.STRING,
                  description: "Unidades específicas y cantidad de equipo",
                },
                tactics: {
                  type: Type.STRING,
                  description:
                    "Análisis profundo de maniobras, tecnologías usadas y doctrina aplicada",
                },
                outcome: {
                  type: Type.STRING,
                  description: "Resultado estratégico de la batalla",
                },
                casualties: {
                  type: Type.STRING,
                  description:
                    "Estimación de bajas y equipo perdido en este encuentro",
                },
              },
              required: ["location", "forcesInvolved", "tactics", "outcome"],
            },
          },
          nonMilitaryEvents: {
            type: Type.STRING,
            description:
              "Sanciones, crisis de refugiados, ciberataques a civiles y reacciones diplomáticas",
          },
        },
        required: ["phase", "chronology", "importantBattles"],
      },
    },

    // FASE IV: COMPONENTE HUMANO (Diario del soldado)
    soldierDiary: {
      type: Type.OBJECT,
      properties: {
        character: {
          type: Type.STRING,
          description: "Nombre, rango, unidad y motivaciones del soldado",
        },
        entries: {
          type: Type.STRING,
          description:
            "Relato crudo y dramático en 1ª persona (mínimo 500 palabras). Enfocado en el horror del frente.",
        },
      },
      required: ["character", "entries"],
    },

    // FASE V: CONCLUSIÓN Y RESULTADOS
    results: {
      type: Type.STRING,
      description:
        "Consecuencias territoriales, económicas y políticas a largo plazo",
    },
    kiaTotal: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          country: { type: Type.STRING },
          militaryLosses: {
            type: Type.NUMBER,
            description: "Bajas totales de soldados",
          },
          civilianLosses: {
            type: Type.NUMBER,
            description: "Bajas totales de civiles",
          },
        },
        required: ["country", "militaryLosses", "civilianLosses"],
      },
    },
    winner: {
      type: Type.STRING,
      description: "Nación ganadora o descripción de un tratado de paz/empate",
    },
  },
  required: [
    "name",
    "year",
    "casusBelli",
    "aggressorCountry",
    "defenderCountry",
    "warProgress",
    "soldierDiary",
    "results",
    "kiaTotal",
    "winner",
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
    "historicalCuriosities",
    "importantCharacters",
    "events",
  ],
};

const politicsSchema = {
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
              description:
                "Guerras y conflictos históricos o actuales de la nación",
              items: {
                type: Type.OBJECT,
                properties: {
                  opponent: {
                    type: Type.STRING,
                    description: "Nombre de la nación enemiga o histórica",
                  },
                  startDate: {
                    type: Type.STRING,
                    description: "Fecha o periodo de inicio del conflicto",
                  },
                  endDate: {
                    type: Type.STRING,
                    description:
                      "Fecha o periodo de finalización del conflicto (null si está en curso)",
                  },
                  cause: {
                    type: Type.STRING,
                    description:
                      "Causa de la guerra (coherente con historia/geografía/recursos)",
                  },
                  outcome: {
                    type: Type.STRING,
                    description:
                      "Resultado del conflicto: victoria, derrota, empate, tratado específico, en curso",
                  },
                },
                required: ["opponent", "startDate", "cause", "outcome"],
              },
            },
            alliances: {
              type: Type.ARRAY,
              description: "Alianzas estratégicas con otras naciones",
              items: {
                type: Type.OBJECT,
                properties: {
                  nation: {
                    type: Type.STRING,
                    description: "Nombre de la nación aliada",
                  },
                  date: {
                    type: Type.STRING,
                    description: "Fecha o periodo de inicio de la alianza",
                  },
                  purpose: {
                    type: Type.STRING,
                    description:
                      "Propósito de la alianza (defensivo, económico, cultural, contra enemigo común)",
                  },
                },
                required: ["nation", "date", "purpose"],
              },
            },
          },
          required: ["wars", "alliances"],
        },
        influences: {
          type: Type.ARRAY,
          description:
            "Impacto de potencias extranjeras en la soberanía y vida de la nación.",
          items: {
            type: Type.OBJECT,
            properties: {
              originNation: {
                type: Type.STRING,
                description: "Nombre de la nación que ejerce la influencia.",
              },
              area: {
                type: Type.STRING,
                // Usamos una descripción que limite las opciones para guiar a Gemini
                description:
                  "Área afectada: Económica, Cultural, Militar, Política o Tecnológica.",
              },
              powerScore: {
                type: Type.NUMBER,
                description:
                  "Intensidad de la influencia (0 a 100). Donde 100 es dependencia total.",
              },
              impactDescription: {
                type: Type.STRING,
                description:
                  "Efecto específico (ej: 'Controla el 40% de las minas' o 'Su idioma es la segunda lengua').",
              },
              isPositive: {
                type: Type.BOOLEAN,
                description:
                  "Determina si la influencia se percibe como beneficiosa o como una amenaza/imposición.",
              },
            },
            required: [
              "originNation",
              "area",
              "powerScore",
              "impactDescription",
              "isPositive",
            ],
          },
        },
      },
      required: ["geopolitics", "influences"],
    },
    interior: {
      type: Type.OBJECT,
      properties: {
        governmentType: {
          type: Type.STRING,
          description:
            "Tipo de gobierno (Monarquía Absoluta/Constitucional, República Parlamentaria/Presidencialista, Teocracia, Oligarquía, Dictadura, etc.) - coherente con cultura e historia",
        },
        leader: {
          type: Type.OBJECT,
          description: "Información del líder actual de la nación",
          properties: {
            name: {
              type: Type.STRING,
              description: "Nombre del líder actual o figura principal",
            },
            title: {
              type: Type.STRING,
              description:
                "Título oficial (Rey, Presidente, Sumo Sacerdote, Canciller, Emperador, etc.)",
            },
            rulingParty: {
              type: Type.STRING,
              description:
                "Partido o facción gobernante (si aplica, o 'No aplica' para monarquías absolutas)",
            },
            succession: {
              type: Type.STRING,
              description:
                "Sistema de sucesión: hereditaria, elección popular, elección indirecta, golpe de estado, designación religiosa, etc.",
            },
          },
          required: ["name", "title", "rulingParty", "succession"],
        },
        legislativeBranch: {
          type: Type.OBJECT,
          description: "Información sobre el poder legislativo",
          properties: {
            name: {
              type: Type.STRING,
              description:
                "Nombre del cuerpo legislativo (Parlamento, Senado, Consejo de Ancianos, Asamblea, Duma, etc.)",
            },
            structure: {
              type: Type.STRING,
              description:
                "Estructura organizacional: unicameral, bicameral, consultivo, ceremonial, etc.",
            },
            powers: {
              type: Type.STRING,
              description:
                "Poderes y responsabilidades (legislar, aprobar presupuestos, controlar al ejecutivo, declarar guerra, etc.)",
            },
          },
          required: ["name", "structure", "powers"],
        },
        judicialBranch: {
          type: Type.OBJECT,
          description: "Información sobre el poder judicial",
          properties: {
            name: {
              type: Type.STRING,
              description:
                "Nombre del sistema judicial (Corte Suprema, Tribunales Religiosos, Tribunal Constitucional, etc.)",
            },
            structure: {
              type: Type.STRING,
              description:
                "Estructura organizacional: jerárquica, independiente, basada en ley común/civil/religiosa/consuetudinaria",
            },
            powers: {
              type: Type.STRING,
              description:
                "Poderes y responsabilidades (interpretar leyes, juzgar disputas, revisión judicial, arbitraje, etc.)",
            },
          },
          required: ["name", "structure", "powers"],
        },
        politicalStability: {
          type: Type.STRING,
          description:
            "Nivel de estabilidad política: Alta, Media, Baja, Volátil - con justificación coherente",
        },
        politicalIdeology: {
          type: Type.STRING,
          description:
            "Ideología política dominante: conservadurismo, liberalismo, socialismo, nacionalismo, teocrática, pragmática, etc.",
        },
        separatism: {
          type: Type.ARRAY,
          description:
            "Movimientos separatistas (si existen, puede estar vacío)",
          items: {
            type: Type.OBJECT,
            properties: {
              region: {
                type: Type.STRING,
                description:
                  "Región con tendencias separatistas (coherente con geografía/cultura)",
              },
              demands: {
                type: Type.STRING,
                description:
                  "Demandas del movimiento: independencia, autonomía, derechos culturales, etc.",
              },
              strength: {
                type: Type.STRING,
                description:
                  "Fuerza del movimiento: Alta, Media, Baja, Latente, Violento, Pacífico",
              },
            },
            required: ["region", "demands", "strength"],
          },
        },
        tensions: {
          type: Type.OBJECT,
          description: "Tensiones internas en la nación",
          properties: {
            cultural: {
              type: Type.ARRAY,
              description: "Tensiones culturales entre grupos",
              items: {
                type: Type.OBJECT,
                properties: {
                  group: {
                    type: Type.STRING,
                    description:
                      "Grupo cultural afectado (minoría étnica, grupo lingüístico, etc.)",
                  },
                  issue: {
                    type: Type.STRING,
                    description: "Problema específico del conflicto cultural",
                  },
                  severity: {
                    type: Type.STRING,
                    description: "Severidad del conflicto: Alta, Media, Baja",
                  },
                },
                required: ["group", "issue", "severity"],
              },
            },
            religious: {
              type: Type.ARRAY,
              description: "Tensiones religiosas entre grupos",
              items: {
                type: Type.OBJECT,
                properties: {
                  religion: {
                    type: Type.STRING,
                    description: "Religión o secta involucrada en el conflicto",
                  },
                  issue: {
                    type: Type.STRING,
                    description: "Problema específico del conflicto religioso",
                  },
                  severity: {
                    type: Type.STRING,
                    description: "Severidad del conflicto: Alta, Media, Baja",
                  },
                },
                required: ["religion", "issue", "severity"],
              },
            },
            political: {
              type: Type.ARRAY,
              description: "Tensiones políticas entre facciones o partidos",
              items: {
                type: Type.OBJECT,
                properties: {
                  party: {
                    type: Type.STRING,
                    description: "Partido o facción política involucrada",
                  },
                  issue: {
                    type: Type.STRING,
                    description:
                      "Problema específico (ideológico, lucha por poder, corrupción, etc.)",
                  },
                  severity: {
                    type: Type.STRING,
                    description: "Severidad del conflicto: Alta, Media, Baja",
                  },
                },
                required: ["party", "issue", "severity"],
              },
            },
          },
          required: ["cultural", "religious", "political"],
        },
      },
      required: [
        "governmentType",
        "leader",
        "legislativeBranch",
        "judicialBranch",
        "politicalStability",
        "politicalIdeology",
        "separatism",
        "tensions",
      ],
    },
  },
  required: ["exterior", "interior"],
};

const economySchema = {
  type: Type.OBJECT,
  properties: {
    economicSystem: {
      type: Type.STRING,
      description:
        "Tipo de Sistema Económico (Capitalista de Mercado, Planificado Centralmente, Mixto, Feudal, Agrario, Gremial, etc. - coherente con política/cultura)",
    },
    keySectors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sectorName: {
            type: Type.STRING,
            description:
              "Nombre del Sector Principal (Agricultura, Minería, Manufactura, Servicios, Tecnología, Turismo, etc.)",
          },
          importance: {
            type: Type.STRING,
            description: "Importancia Relativa: alta, media, baja",
          },
        },
        required: ["sectorName", "importance"],
      },
    },
    currency: {
      type: Type.OBJECT,
      properties: {
        currencyName: {
          type: Type.STRING,
          description: "Nombre de la Moneda",
        },
        currencySymbol: {
          type: Type.STRING,
          description: "Símbolo de la Moneda (si existe, ej. $, €, ¥)",
        },
        stability: {
          type: Type.STRING,
          description: "Estabilidad de la Moneda: alta, media, baja, volátil",
        },
      },
      required: ["currencyName", "currencySymbol", "stability"],
    },
    naturalResources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          resourceName: {
            type: Type.STRING,
            description: "Nombre del Recurso Natural (coherente con geografía)",
          },
          abundance: {
            type: Type.STRING,
            description:
              "Abundancia: abundante, moderado, escaso, sin explotar",
          },
        },
        required: ["resourceName", "abundance"],
      },
    },
    economicLaw: {
      type: Type.OBJECT,
      properties: {
        propertyRights: {
          type: Type.STRING,
          description:
            "Descripción de los Derechos de Propiedad (fuertes, débiles, estatales, comunales, mixtos)",
        },
        contractLaw: {
          type: Type.STRING,
          description:
            "Descripción del Derecho Contractual (desarrollado, básico, basado en costumbre, influencia religiosa)",
        },
        taxSystem: {
          type: Type.STRING,
          description:
            "Descripción del Sistema Fiscal (progresivo, regresivo, plano, tipos principales de impuestos: renta, consumo, corporativo, propiedad)",
        },
        regulationLevel: {
          type: Type.STRING,
          description:
            "Nivel General de Regulación Económica: alto, medio, bajo, sector específico",
        },
      },
      required: [
        "propertyRights",
        "contractLaw",
        "taxSystem",
        "regulationLevel",
      ],
    },
    tradePolicy: {
      type: Type.OBJECT,
      properties: {
        openness: {
          type: Type.STRING,
          description:
            "Nivel de Apertura Comercial: abierta, proteccionista, mixta",
        },
        majorExports: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "Producto/Servicio Principal de Exportación",
          },
        },
        majorImports: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "Producto/Servicio Principal de Importación",
          },
        },
        tariffs: {
          type: Type.STRING,
          description:
            "Política Arancelaria General: altos, bajos, selectivos, inexistentes",
        },
        tradeAgreements: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              partnerNation: {
                type: Type.STRING,
                description: "Nombre Nación Socia Comercial o Bloque",
              },
              agreementType: {
                type: Type.STRING,
                description:
                  "Tipo de Acuerdo: libre comercio, unión aduanera, preferencial",
              },
            },
            required: ["partnerNation", "agreementType"],
          },
        },
      },
      required: [
        "openness",
        "majorExports",
        "majorImports",
        "tariffs",
        "tradeAgreements",
      ],
    },
    infrastructure: {
      type: Type.OBJECT,
      properties: {
        transportation: {
          type: Type.STRING,
          description:
            "Nivel de Desarrollo del Transporte (desarrollado, en desarrollo, pobre, red específica: carreteras, ferrocarril, puertos)",
        },
        energy: {
          type: Type.STRING,
          description:
            "Disponibilidad y Fuente de Energía (confiable, poco confiable, fuentes principales: fósil, renovable, nuclear, importada)",
        },
        communication: {
          type: Type.STRING,
          description:
            "Nivel de Desarrollo de Comunicaciones (avanzado, básico, limitado, penetración de internet)",
        },
      },
      required: ["transportation", "energy", "communication"],
    },
    wealthDistribution: {
      type: Type.STRING,
      description:
        "Distribución de la Riqueza: muy desigual, moderadamente desigual, relativamente igualitaria",
    },
    economicStability: {
      type: Type.STRING,
      description:
        "Estabilidad Económica General: estable, creciente, estancada, en declive, volátil",
    },
    inflationRate: {
      type: Type.STRING,
      description: "Tasa de Inflación Estimada: alta, media, baja, controlada",
    },
  },
  required: [
    "economicSystem",
    "keySectors",
    "currency",
    "naturalResources",
    "economicLaw",
    "tradePolicy",
    "infrastructure",
    "wealthDistribution",
    "economicStability",
    "inflationRate",
  ],
};

const populationSchema = {
  type: Type.OBJECT,
  properties: {
    totalPopulation: {
      type: Type.NUMBER,
      description: "Número estimado de habitantes",
    },
    populationGrowthRate: {
      type: Type.NUMBER,
      description: "Tasa de crecimiento poblacional (ej. 1.5% anual)",
    },
    lifeExpectancy: {
      type: Type.OBJECT,
      properties: {
        male: {
          type: Type.NUMBER,
          description: "Esperanza de vida para hombres",
        },
        female: {
          type: Type.NUMBER,
          description: "Esperanza de vida para mujeres",
        },
        overall: {
          type: Type.NUMBER,
          description: "Esperanza de vida general",
        },
      },
      required: ["male", "female", "overall"],
    },
    ethnicGroups: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          groupName: {
            type: Type.STRING,
            description: "Nombre del grupo étnico",
          },
          percentage: {
            type: Type.NUMBER,
            description:
              "Porcentaje de la población (Con este formato 0 a 100)",
          },
          notes: {
            type: Type.STRING,
            description: "Notas adicionales sobre el grupo",
          },
        },
        required: ["groupName", "percentage", "notes"],
      },
    },
    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          languageName: {
            type: Type.STRING,
            description: "Nombre del idioma",
          },
          status: {
            type: Type.STRING,
            description:
              "Estatus: oficial, regional, minoritario, lingua franca",
          },
          percentageSpeakers: {
            type: Type.NUMBER,
            description: "Porcentaje de hablantes (Con este formato 0 a 100)",
          },
        },
        required: ["languageName", "status", "percentageSpeakers"],
      },
    },
    religions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          religionName: {
            type: Type.STRING,
            description: "Nombre conciso de la religión",
          },
          percentageAdherents: {
            type: Type.NUMBER,
            description: "Porcentaje de seguidores (Con este formato 0 a 100)",
          },
          influence: {
            type: Type.STRING,
            description: "Nivel de influencia: alto, medio, bajo",
          },
        },
        required: ["religionName", "percentageAdherents", "influence"],
      },
    },
    urbanRuralSplit: {
      type: Type.OBJECT,
      properties: {
        urbanPercentage: {
          type: Type.NUMBER,
          description:
            "Porcentaje de población urbana (Con este formato 0 a 100)",
        },
        ruralPercentage: {
          type: Type.NUMBER,
          description:
            "Porcentaje de población rural (Con este formato 0 a 100)",
        },
        majorCities: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "Nombre de ciudad principal",
          },
        },
      },
      required: ["urbanPercentage", "ruralPercentage", "majorCities"],
    },
    ageDistribution: {
      type: Type.OBJECT,
      properties: {
        medianAge: {
          type: Type.NUMBER,
          description: "Edad mediana de la población",
        },
        ageBrackets: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              bracket: {
                type: Type.STRING,
                description: "Rango de edad (ej. 0-14 años)",
              },
              percentage: {
                type: Type.NUMBER,
                description:
                  "Porcentaje en este rango (Con este formato 0 a 100)",
              },
            },
            required: ["bracket", "percentage"],
          },
        },
      },
      required: ["medianAge", "ageBrackets"],
    },
    educationLevel: {
      type: Type.STRING,
      description:
        "Descripción general del nivel educativo y sistema educativo",
    },
    literacyRate: {
      type: Type.NUMBER,
      description: "Tasa de alfabetización (Con este formato 0 a 100)",
    },
    populationDensity: {
      type: Type.NUMBER,
      description: "Densidad de población (habitantes por km²)",
    },
    health: {
      type: Type.OBJECT,
      properties: {
        infantMortalityRate: {
          type: Type.NUMBER,
          description:
            "Tasa de mortalidad infantil por 1000 nacidos vivos (Con este formato 0 a 100)",
        },
        accessToHealthcare: {
          type: Type.STRING,
          description:
            "Nivel de acceso a la atención médica: bueno, moderado, pobre",
        },
      },
      required: ["infantMortalityRate", "accessToHealthcare"],
    },
    migration: {
      type: Type.OBJECT,
      properties: {
        immigrationRate: {
          type: Type.NUMBER,
          description:
            "Porcentaje de la población total que es inmigrante (Con este formato 0 a 100)",
        },
        emigrationRate: {
          type: Type.NUMBER,
          description:
            "Porcentaje de la población total que emigra (Con este formato 0 a 100)",
        },
        mainOriginsDestinations: {
          type: Type.STRING,
          description: "Principales países de origen y destino migratorio",
        },
      },
      required: [
        "immigrationRate",
        "emigrationRate",
        "mainOriginsDestinations",
      ],
    },
    workforceDistribution: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sector: {
            type: Type.STRING,
            description:
              "Sector económico (Agricultura, Industria, Servicios, etc.)",
          },
          percentage: {
            type: Type.NUMBER,
            description:
              "Porcentaje de la fuerza laboral en este sector (Con este formato 0 a 100)",
          },
          dominantProfessions: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
              description: "Profesión dominante en el sector",
            },
          },
        },
        required: ["sector", "percentage", "dominantProfessions"],
      },
    },
    socialClasses: {
      type: Type.STRING,
      description:
        "Descripción de la estructura de clases sociales y sus características",
    },
  },
  required: [
    "totalPopulation",
    "populationGrowthRate",
    "lifeExpectancy",
    "ethnicGroups",
    "languages",
    "religions",
    "urbanRuralSplit",
    "ageDistribution",
    "educationLevel",
    "literacyRate",
    "populationDensity",
    "health",
    "migration",
    "workforceDistribution",
    "socialClasses",
  ],
};

const nationConfig = {
  temperature: 0.5,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  _responseJsonSchema: nationSchema,
  systemInstruction: nationSystemInstruction,
};

const warConfig = {
  temperature: 0.2,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  _responseJsonSchema: warSchema,
  systemInstruction: warSystemInstruction,
};

export async function generateNation(nationConcept, governmentType, age) {
  const chat = genAI.chats.create({
    model: geminiModel,
    config: {
      ...nationConfig,
    },
  });

  const result1 = await chat.sendMessage({
    message: `Genera una nación: ${nationConcept}, gobierno: ${governmentType}, era: ${age}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: nationSchema,
    },
  });
  const nation = JSON.parse(result1.text);

  const result2 = await chat.sendMessage({
    message: `Basándote en este JSON: ${nation}, genera detalles políticos detallados.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: politicsSchema,
    },
  });
  const politics = JSON.parse(result2.text);

  const result3 = await chat.sendMessage({
    message: `Para este JSON ${nation} ${politics} con gobierno ${governmentType}, genera la economía.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: economySchema,
    },
  });
  const economy = JSON.parse(result3.text);

  const result4 = await chat.sendMessage({
    message: `Para ${nation} ${politics} ${economy}, genera demografía coherente.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: populationSchema,
    },
  });
  const population = JSON.parse(result4.text);

  return {
    ...nation,
    politicsDetails: politics,
    economyDetails: economy,
    populationDetails: population,
  };
}

export async function generateWar(aggressor, defender, casusBelli, age) {
  const result = await genAI.models.generateContent({
    model: geminiModel,
    contents: `Genera una simulación de guerra histórica con estas identidades:
                - Agresor: ${aggressor}
                - Defensor: ${defender}
                - Era: ${age}
                - Motivo: ${casusBelli}
                IMPORTANTE: RESPETA EL STRUCTURED OUTPUT Y LA ESTRUCTURA OFRECIDA
                `,
    config: warConfig,
  });

  const war = JSON.parse(result.text);

  return war;
}

/*export async function generateNationAdvanced(
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
    config: nationConfig,
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
*/
