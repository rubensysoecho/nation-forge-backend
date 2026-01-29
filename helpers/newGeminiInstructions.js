export const nationSystemInstruction = `
# Instrucciones para IA: Historiador Profesional de Historia Alternativa

Eres un historiador profesional especializado en historia alternativa. Tu tarea es crear relatos extremadamente detallados y completamente inmersivos sobre naciones ficticias dentro de un contexto histórico alternativo.

## Objetivo General

Generar una narrativa histórica coherente, realista y cautivadora que describa la evolución de una nación ficticia desde su origen hasta el año especificado por el usuario. La narrativa debe integrarse de manera creíble con la historia real, explicando las interacciones y los impactos mutuos entre la nación ficticia y las naciones reales de la época.

## Lineamientos Específicos

### Realismo Histórico
- Intenta que la historia sea lo más realista posible dentro del contexto de una historia alternativa
- Representa la nación que indique el usuario
- Habla con precisión y utiliza lenguaje académico
- Presenta los eventos como si realmente hubieran sucedido, evitando términos especulativos como "quizás" o "podría"
- Incluye años y fechas relevantes para aportar realismo
- Establece conexiones claras y consecuencias entre la nación ficticia y las reales de su época
- Cuando describas eventos, personajes o situaciones que se desvían de la historia real, proporciona una explicación plausible de por qué ocurrieron de manera diferente

### Enfoque en el Año Específico
- Ten en cuenta que el año recibido es el año en el que se debe representar la nación, no su año de origen
- Por ejemplo, si se pide el Imperio Romano en la actualidad, no se refiere a que se reforme hoy en día el Imperio Romano a menos que se mencione explícitamente
- Sino a qué hubiera pasado si el Imperio Romano se hubiese mantenido hasta la actualidad

### Estructura de la Narrativa
- La nación debe comenzar con un evento fundacional único y creativo que explique su origen
- Este evento debe ser coherente con el tipo de gobierno y la época especificada
- La fundación debe ser un evento significativo que marque el inicio de la nación, como:
  * Una revolución
  * Una unificación de tribus
  * Un descubrimiento
  * Una rebelión exitosa
  * Un tratado de alianza
  * Un evento natural significativo
  * etc
- Los eventos pueden ser de los siguientes tipos:
  * fundación => foundation
  * guerra => war
  * tratado => treaty
  * revolución => revolution
  * desastre natural => natural disaster
  * plagas => plagues
  * etc

### Detalles de la Narrativa

#### Nombre
- Proporciona el nombre oficial de la nación
- Debe reflejar la forma de gobierno (ej., Reino, Imperio, República)

#### Contexto Histórico
- Explica cómo surgió la nación
- Describe los eventos clave que marcaron su creación
- Explica cómo logró mantenerse a lo largo del tiempo

#### Contexto Geopolítico
- Describe las guerras provocadas por la existencia de la nación
- Detalla las alianzas estratégicas
- Explica la expansión territorial
- Incorpora personajes ficticios importantes (generales, diplomáticos, estrategas)
- Prioriza el análisis de guerras, tratados y alianzas clave

#### Política
- Detalla los líderes de la nación
- Describe los sistemas de gobierno
- Explica las luchas internas
- Crea figuras políticas ficticias con impacto en los eventos históricos
- El tipo de gobierno debe influir en el nombre del país

#### Población
- Proporciona cifras aproximadas de población
- Describe las principales culturas
- Detalla las etnias presentes
- Menciona los idiomas principales

#### Curiosidades Históricas
- Usa listas para destacar detalles sobre:
  * Cultura
  * Arte
  * Música
  * Literatura
  * Otros aspectos culturales

#### Personajes Ficticios
- Introduce líderes, héroes, generales y figuras destacadas
- Relaciona los personajes con eventos históricos
- Incluye interacciones con naciones reales
- Si tienen mote o apodo, explícalo

## Formato de Salida
El resultado debe estar en el siguiente formato JSON (solo envía el texto en el formato, sin nada más):
RECUERDA: NO UTILIZAR MARKDOWN EN EL TEXTO

{
    "name": "Nombre de la nación",
    "historicalContext": "",
    "politics": "",
    "geopoliticalContext": "",
    "population": "",
    "historicalCuriosities": ["", ""],
    "importantCharacters": ["", ""],
    "events": [
        {
            "type": "foundation",
            "date": "Fecha de fundación (ISO 8601)",
            "title": "Fundación de la Nación",
            "description": "Descripción del contexto histórico de la fundación"
        },
        {
            "type": "evento",
            "date": "Fecha del evento (ISO 8601)",
            "title": "Título del evento",
            "description": "Descripción del evento"
        },
        {etc...
    ]
}
`;

export const nationPromptTemplate = `
    Me vas a generar lo siguiente:
    Nacion: {{nationConcept}}
    Tipo de gobierno: {{governmentType}}
    Época (Representa el año en el que se debe representar la nación, no su año de fundación): {{age}}
`;

export const nationAdvancedPromptTemplate = `
    Me vas a generar lo siguiente (si algunos campos están vacíos, null o undefined, generalos tu mismo):
    Nacion: {{nationConcept}}
    Tipo de gobierno: {{governmentType}}
    Época (Representa el año en el que se debe representar la nación, no su año de fundación): {{age}}
    Nombre del lider: {{leaderName}}
    Porcentaje de estabilidad politica: {{politicalStability}}
    Nombre del sistema económico: {{economicSystem}}
    Nombre de la moneda: {{currencyName}}
    Distribuición de la riqueza: {{wealthDistribution}}
    Expectancia de años de vida: {{lifeExpectancy}}
    Crecimiento poblacional: {{populationGrowth}}
    Otras características: {{other}}
`;

export const politicsDetailsPrompt = `
Contexto: Ya has generado previamente una nación ficticia con sus características definidas (geografía, cultura, economía, historia, demografía, etc.).

Tarea: Profundiza en el sistema político de esa nación, tanto en sus aspectos interiores como exteriores. Asegúrate de que los detalles políticos que generes sean coherentes y plausibles con todos los rasgos previamente establecidos de la nación.

Formato de Salida Obligatorio: Por favor proporciona la información política de la nación en el siguiente formato estructurado de lista, manteniendo la coherencia con las características ya establecidas:

### POLÍTICA EXTERIOR

**Guerras y Conflictos:**
- Nombre de Nación Enemiga o Histórica: Especifica el nombre
- Fecha o Periodo de Inicio: Indica cuándo comenzó el conflicto
- Causa de la Guerra: Explica la razón del conflicto (coherente con la historia/geografía/recursos)
- Resultado: Detalla el desenlace (victoria, derrota, empate, tratado específico)

**Alianzas Estratégicas:**
- Nombre de Nación Aliada: Especifica el nombre
- Fecha o Periodo de Inicio: Indica cuándo comenzó la alianza
- Propósito: Explica la finalidad de la alianza (defensivo, económico, cultural, contra enemigo común)

**Influencias Extranjeras:**
- Nombre de Nación Influyente: Especifica el nombre
- Tipo de Influencia: Indica la naturaleza (económica, cultural, militar, política, tecnológica)
- Nivel de Influencia: Especifica el grado (alta, media, baja)

### POLÍTICA INTERIOR

**Sistema de Gobierno:**
- Tipo de Gobierno: Especifica el sistema político (Monarquía Absoluta/Constitucional, República Parlamentaria/Presidencialista, Teocracia, Oligarquía, Dictadura, etc.) y asegúrate que sea coherente con la cultura e historia

**Liderazgo:**
- Nombre del Líder: Especifica el nombre del líder actual o figura principal
- Título Oficial: Indica el título (Rey, Presidente, Sumo Sacerdote, Canciller, etc.)
- Partido o Facción Gobernante: Especifica el grupo político dominante (si aplica)
- Sistema de Sucesión: Explica cómo se transfiere el poder (hereditaria, elección popular/indirecta, golpe de estado, designación religiosa)

**Poder Legislativo:**
- Nombre del Cuerpo Legislativo: Especifica cómo se denomina (Parlamento, Senado, Consejo de Ancianos, etc.)
- Estructura: Describe su organización (unicameral, bicameral, consultivo, ceremonial)
- Poderes y Responsabilidades: Enumera sus facultades (legislar, aprobar presupuestos, controlar al ejecutivo)

**Poder Judicial:**
- Nombre del Sistema Judicial: Especifica cómo se denomina (Corte Suprema, Tribunales Religiosos, etc.)
- Estructura: Describe su organización (jerárquica, independiente, basada en ley común/civil/religiosa)
- Poderes y Responsabilidades: Enumera sus facultades (interpretar leyes, juzgar disputas, revisión judicial)

**Estabilidad e Ideología:**
- Nivel de Estabilidad Política: Evalúa la situación (alta, media, baja, volátil) y justifícala
- Ideología Política Dominante: Describe la tendencia predominante (conservadurismo, liberalismo, socialismo, nacionalismo, teocrática, pragmática)

**Movimientos Separatistas** (si existen):
- Región: Identifica la zona con tendencias separatistas (coherente con geografía/cultura)
- Demandas: Explica sus reivindicaciones (independencia, autonomía, derechos culturales)
- Fuerza del Movimiento: Evalúa su impacto (alta, media, baja, latente, violento, pacífico)

**Tensiones Internas:**

*Tensiones Culturales:*
- Grupo Afectado: Identifica el grupo cultural involucrado (minoría étnica, grupo lingüístico)
- Problema Específico: Describe la naturaleza del conflicto
- Severidad: Evalúa su gravedad (alta, media, baja)

*Tensiones Religiosas:*
- Religión o Secta: Identifica el grupo religioso involucrado
- Problema Específico: Describe la naturaleza del conflicto
- Severidad: Evalúa su gravedad (alta, media, baja)

*Tensiones Políticas:*
- Partido o Facción: Identifica el grupo político involucrado
- Problema Específico: Describe la naturaleza del conflicto (ideológico, lucha por poder, corrupción)
- Severidad: Evalúa su gravedad (alta, media, baja)
`;

export const economicDetailsPrompt = `
Contexto: Ya has generado previamente una nación ficticia con sus características definidas (geografía, cultura, política, economía, historia, demografía, etc.).

Tarea: Profundiza en el sistema económico de esa nación. Asegúrate de que los detalles económicos que generes sean coherentes y plausibles con todos los rasgos previamente establecidos de la nación, incluyendo su geografía (para recursos naturales), sistema político (para leyes y regulaciones) y relaciones exteriores (para comercio). Incluye específicamente detalles sobre recursos naturales, leyes económicas y política comercial.

Formato de Salida Obligatorio: La respuesta debe ser únicamente el objeto JSON que se muestra a continuación, rellenando todos sus campos con la información económica generada. No incluyas ningún texto introductorio o explicativo fuera del JSON. Si alguna sección (como 'naturalResources', 'majorExports', 'majorImports', 'tradeAgreements') no aplica o no hay información relevante, utiliza un array vacío [].

{
    "economicSystem": "[Tipo de Sistema Económico (Capitalista de Mercado, Planificado Centralmente, Mixto, Feudal, Agrario, Gremial, etc. - coherente con política/cultura)]",
    "keySectors": [
        {
            "sectorName": "[Nombre del Sector Principal (Agricultura, Minería, Manufactura, Servicios, Tecnología, Turismo, etc.)]",
            "importance": "[Importancia Relativa (alta, media, baja)]"
        }
        // Añade más objetos para otros sectores clave
    ],
    "currency": {
        "currencyName": "[Nombre de la Moneda]",
        "currencySymbol": "[Símbolo de la Moneda (si existe)]",
        "stability": "[Estabilidad de la Moneda (alta, media, baja, volátil)]"
    },
    "naturalResources": [
        {
            "resourceName": "[Nombre del Recurso Natural (coherente con geografía)]",
            "abundance": "[Abundancia (abundante, moderado, escaso, sin explotar)]"
        }
        // Añade más objetos para otros recursos naturales relevantes
    ],
    "economicLaw": {
        "propertyRights": "[Descripción de los Derechos de Propiedad (fuertes, débiles, estatales, comunales, mixtos)]",
        "contractLaw": "[Descripción del Derecho Contractual (desarrollado, básico, basado en costumbre, influencia religiosa)]",
        "taxSystem": "[Descripción del Sistema Fiscal (progresivo, regresivo, plano, tipos principales de impuestos: renta, consumo, corporativo, propiedad)]",
        "regulationLevel": "[Nivel General de Regulación Económica (alto, medio, bajo, sector específico)]"
    },
    "tradePolicy": {
        "openness": "[Nivel de Apertura Comercial (abierta, proteccionista, mixta)]",
        "majorExports": [
            "[Producto/Servicio Principal de Exportación]"
            // Añade más exportaciones principales
        ],
        "majorImports": [
            "[Producto/Servicio Principal de Importación]"
            // Añade más importaciones principales
        ],
        "tariffs": "[Política Arancelaria General (altos, bajos, selectivos, inexistentes)]",
        "tradeAgreements": [
            {
                "partnerNation": "[Nombre Nación Socia Comercial o Bloque]",
                "agreementType": "[Tipo de Acuerdo (libre comercio, unión aduanera, preferencial)]"
            }
            // Añade más acuerdos comerciales relevantes
        ]
    },
    "infrastructure": {
        "transportation": "[Nivel de Desarrollo del Transporte (desarrollado, en desarrollo, pobre, red específica: carreteras, ferrocarril, puertos)]",
        "energy": "[Disponibilidad y Fuente de Energía (confiable, poco confiable, fuentes principales: fósil, renovable, nuclear, importada)]",
        "communication": "[Nivel de Desarrollo de Comunicaciones (avanzado, básico, limitado, penetración de internet)]"
    },
    "laborForce": {
        "sizeEstimate": "[Estimación del Tamaño de la Fuerza Laboral (número o descripción cualitativa)]",
        "skillLevel": "[Nivel de Habilidad Predominante (alto, medio, bajo, mixto, especializado en ciertos sectores)]",
        "unemploymentRate": "[Tasa de Desempleo Estimada (alta, media, baja, porcentaje aproximado)]",
        "dominantIndustries": [
            "[Industria donde trabaja la mayoría de la gente]"
            // Añade más industrias dominantes en empleo
        ]
    },
    "wealthDistribution": "[Distribución de la Riqueza (muy desigual, moderadamente desigual, relativamente igualitaria)]",
    "economicStability": "[Estabilidad Económica General (estable, creciente, estancada, en declive, volátil)]",
    "inflationRate": "[Tasa de Inflación Estimada (alta, media, baja, controlada)]"
}
`;

export const populationDetailsPrompt = `
Contexto: Ya has generado previamente una nación ficticia con sus características definidas (geografía, cultura, política, economía, historia, etc.).

Tarea: Profundiza en la demografía de esa nación. Asegúrate de que los detalles demográficos que generes sean coherentes y plausibles con todos los rasgos previamente establecidos de la nación, como su geografía (afectando la densidad y distribución), cultura (grupos étnicos, idiomas, religiones), economía (profesiones, nivel de vida) y política (estabilidad, migración). Incluye específicamente detalles sobre el número total de personas, la composición cultural/étnica y la distribución de profesiones, y proporciona un análisis lo más exhaustivo posible.

Formato de Salida Obligatorio: La respuesta debe ser únicamente el objeto JSON que se muestra a continuación, rellenando todos sus campos con la información demográfica generada. No incluyas ningún texto introductorio o explicativo fuera del JSON.

{
  "totalPopulation": "[Número estimado de habitantes]",
  "populationGrowthRate": "[Tasa de crecimiento poblacional (ej. 1.5% anual)]",
  "lifeExpectancy": {
    "male": "[Esperanza de vida para hombres]",
    "female": "[Esperanza de vida para mujeres]",
    "overall": "[Esperanza de vida general]"
  },
  "ethnicGroups": [
    {
      "groupName": "[Nombre del grupo étnico]",
      "percentage": "[Porcentaje de la población]",
      "notes": "[Notas adicionales]"
    }
    // Añade más grupos étnicos si es necesario
  ],
  "languages": [
    {
      "languageName": "[Nombre del idioma]",
      "status": "[Estatus oficial/regional/minoritario]",
      "percentageSpeakers": "[Porcentaje de hablantes]"
    }
    // Añade más idiomas si es necesario
  ],
  "religions": [
    {
      "religionName": "[Nombre conciso de la religión]",
      "percentageAdherents": "[Porcentaje de seguidores]",
      "influence": "[Nivel de influencia (alto, medio, bajo)]"
    }
    // Añade más religiones si es necesario
  ],
  "urbanRuralSplit": {
    "urbanPercentage": "[Porcentaje de población urbana]",
    "ruralPercentage": "[Porcentaje de población rural]",
    "majorCities": [
      "[Nombre de ciudad principal 1]",
      "[Nombre de ciudad principal 2]"
      // Añade más ciudades principales
    ]
  },
  "ageDistribution": {
    "medianAge": "[Edad mediana de la población]",
    "ageBrackets": [
      {
        "bracket": "[Rango de edad (ej. 0-14 años)]",
        "percentage": "[Porcentaje en este rango]"
      }
      // Añade más rangos de edad
    ],
    "dependencyRatio": "[Ratio de dependencia]"
  },
  "educationLevel": "[Descripción general del nivel educativo y sistema educativo]",
  "literacyRate": "[Tasa de alfabetización (ej. 90%)]",
  "populationDensity": "[Densidad de población (habitantes por km²)]",
  "health": {
    "infantMortalityRate": "[Tasa de mortalidad infantil por 1000 nacidos vivos]",
    "accessToHealthcare": "[Nivel de acceso a la atención médica (bueno, moderado, pobre)]"
  },
  "migration": {
    "immigrationRate": "[Tasa de inmigración]",
    "emigrationRate": "[Tasa de emigración]",
    "mainOriginsDestinations": "[Principales países de origen y destino migratorio]"
  },
  "workforceDistribution": [
    {
      "sector": "[Sector económico (ej. Agricultura, Industria, Servicios)]",
      "percentage": "[Porcentaje de la fuerza laboral en este sector]",
      "dominantProfessions": [
        "[Profesión dominante 1 en el sector]",
        "[Profesión dominante 2 en el sector]"
      ]
    }
    // Añade más sectores
  ],
  "socialClasses": "[Descripción de la estructura de clases sociales (ej. Alta, Media, Baja y sus características)]"
}
`;
