import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Reemplaza con tu clave de API de OpenAI
});

async function generateNation(nationConcept, governmentType, age) {
    const jsonFormat = {
        nation_name: "",
        historical_context: "",
        geopolitical_context: "",
        politics: "",
        population: "",
        historical_curiosities: ["", ""],
        important_characters: ["", ""]
    };
    

    /*const jsonFormat = {
        "nation": {
            "name": "",
            "narrative": "",
            "politics": {
                "exterior": {
                    "wars": [
                        {
                            "name": "",
                            "causas": "",
                            "beligerantes": [
                                { "nacion": "", "bando": "" }
                            ],
                            "duracion": "",
                            "resultados": "",
                            "bajas": {
                                "militares": 0,
                                "civiles": 0
                            },
                            "impacto": "",
                            "eventos_clave": [
                                {
                                    "tipo": "",
                                    "ubicacion": "",
                                    "fecha": "",
                                    "descripcion": ""
                                }
                            ]
                        }
                    ],
                    "alliances": [
                        {
                            "name": "",
                            "members": []
                        }
                    ]
                },
                "interior": {
                    "government_type": "",
                    "political_ideology": "",
                    "leaders": [
                        {
                            "name": "",
                            "title": "",
                            "start_date": "",
                            "end_date": ""
                        }
                    ],
                    "tensions": {
                        "cultural": [
                            {
                                "organization": "",
                                "demands": "",
                                "actions": ""
                            },
                        ],
                        "religious": [
                            {
                                "organization": "",
                                "demands": "",
                                "actions": ""
                            },
                        ],
                        "political": [
                            {
                                "organization": "",
                                "demands": "",
                                "actions": ""
                            },
                        ]
                    }
                }
            },
            "economy": {
                "resources": [
                    { 
                        "name": "",
                        "quantity": "",
                        "unit": "",
                    },
                ], // More concise name
                "laws": { // Group laws for better organization
                    "economic": "",
                    "trade": ""
                }
            },
            "history": {
                "origin": "",
                "key_events": []  // Add key events to the history
            },
            "demographics": {
                "population": {
                    "size": "",
                    "ethnicities": []
                },
                "cultures": [],
                "occupations": []
            },
            "geography": {
                "land_area": "",
                "climate": "",
                "natural_features": []
            },
            "culture": {
                "traditions": [],
                "arts": [],
                "languages": []
            }
        }
    };*/

    const userPrompt = `Explain how the concept of '${nationConcept}' could have shaped or existed during the '${age}' with a '${governmentType}' type of government.`;

    const systemContent = `
    Eres un historiador profesional especializado en historia alternativa. Tu tarea es crear relatos extremadamente detallados y completamente inmersivos sobre naciones ficticias dentro de un contexto histórico alternativo. 
    - **Contexto histórico:** Explica cómo surgió la nación, los eventos clave que marcaron su creación y cómo logró mantenerse a lo largo del tiempo. 
    - **Contexto geopolítico:** Describe las guerras provocadas por la existencia de la nación, las alianzas estratégicas y la expansión territorial que experimentó. Incorpora personajes ficticios importantes, como generales, diplomáticos o estrategas, relacionados con los eventos descritos. 
    - **Política:** Detalla los líderes de la nación, los sistemas de gobierno, las luchas internas y los temas nacionales más destacados. Crea figuras políticas ficticias con impacto en los eventos históricos de la nación. 
    - **Población:** Proporciona cifras aproximadas de población y describe las principales culturas, etnias e idiomas presentes en la nación. 
    - **Curiosidades históricas:** Usa listas o viñetas para destacar detalles sobre la cultura, el arte, la música, la literatura y otros aspectos que enriquezcan la historia de la nación. 
    - **Importancia de personajes ficticios:** Introduce líderes, héroes, generales y figuras destacadas que hayan desempeñado roles cruciales en la historia de la nación ficticia. Estos personajes deben estar relacionados con los eventos históricos y las interacciones con naciones reales del período, en caso de tener mote o apodo, explicarlo. 

    Lineamientos específicos:
    - Intenta que la historia sea lo más realista posible dentro del contexto de una historia alternativa.
    - Representa la nación que diga el usuario.
    - Habla con precisión y utiliza lenguaje académico.
    - Presenta los eventos como si realmente hubieran sucedido, evitando términos especulativos como "quizás" o "podría".
    - Incluye años y fechas relevantes para aportar realismo.
    - Establece conexiones claras y consecuencias entre la nación ficticia y las reales de su época.
    - Escribe en español y organiza la información utilizando encabezados bien estructurados.
    - Geopolíticamente, prioriza el análisis de guerras, tratados y alianzas clave.
    - Envíalo en formato JSON en el siguiente formato: '${JSON.stringify(jsonFormat)}'

    Tu objetivo es ofrecer una narración inmersiva y realista que haga que la historia alternativa sea tan convincente como la historia real.
    `;

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        presence_penalty: 0.5,
        frequency_penalty: 0.3,
        max_tokens: 4096,
        messages: [
            { role: 'system', content: systemContent },
            { role: 'user', content: userPrompt },
        ],
    });

    return completion.choices[0].message.content;
}

export { generateNation };
