import Nation from '../models/nation/nationModel.js';
import { Event } from '../models/nation/events/eventModel.js';
import { generateNationGemini, generateNationAdvancedGemini, generateNationRandomGemini, generateOpenAiImage } from '../config/gemini.js';

const generateImage = async (req, res) => {
    try {
        const { nationConcept, governmentType, age } = req.body;
        const imageUrl = await generateOpenAiImage(nationConcept, governmentType, age);
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ message: 'Error generating image', error: error.message });
    }
}

// METODOS GET
const getNations = async (req, res) => {
    try {
        const nations = await Nation.find(); // Filtra por userId
        res.send(nations);
    } catch (error) {
        console.error(error); // Usa console.error para errores
        res.status(500).send({ msg: "Error retrieving nations", error: error.message }); // Añade el mensaje de error
    }
};

const getNationsUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Obtiene el userId de los query parameters

        if (!userId) {
            return res.status(400).send({ msg: "userId is required in query parameters" });
        }

        const nations = await Nation.find({ creator: userId });
        res.send(nations);
    } catch (error) {
        console.error('❌ Error in getNationsUser:', error);
        res.status(500).send({ msg: "Error retrieving nations", error: error.message });
    }
};

const getNationsUserSimple = async (req, res) => {
    try {
        const userId = req.params.userId; // Obtiene el userId de los query parameters

        if (!userId) {
            return res.status(400).send({ msg: "userId is required in query parameters" });
        }

        const nations = await Nation.find({ creator: userId }).select('name _id');
        res.send(nations);
    } catch (error) {
        console.error('❌ Error in getNationsUser:', error);
        res.status(500).send({ msg: "Error retrieving nations", error: error.message });
    }
}

const getNationDetails = async (req, res) => {
    try {
        const nationId = req.params.nationId; // Cambiado de req.query.nationId

        if (!nationId) {
            return res.status(400).send({ msg: "nationId is required in query parameters" });
        }

        const nation = await Nation.findById(nationId);

        if (!nation) {
            return res.status(404).send({ msg: "Nation not found" });
        }

        res.send(nation);
    } catch (error) {
        console.error('❌ Error in getNationDetails:', error);
        res.status(500).send({ msg: "Error retrieving nation details", error: error.message });
    }
}

// METODOS POST
const createNationGemini = async (req, res) => {
    try {
        console.log(`🌏 Iniciando generación de nación...`);
        console.log(`📋 Parámetros: nombre=${req.body.nationName}, gobierno=${req.body.governmentType}, era=${req.body.age}`);
        console.log(`🔄 Modo: ${req.body.advanced ? 'Avanzado' : 'Básico'}`);
        
        var nationString = "";
        if (req.body.advanced == true) {
            console.log(`🔍 Generando nación avanzada con parámetros adicionales:`);
            console.log(`👑 Líder: ${req.body.leaderName}`);
            console.log(`📊 Estabilidad política: ${req.body.politicalStability}`);
            console.log(`💰 Sistema económico: ${req.body.economicSystem}`);
            console.log(`💵 Moneda: ${req.body.currencyName}`);
            console.log(`📈 Distribución de riqueza: ${req.body.wealthDistribution}`);
            console.log(`🧓 Esperanza de vida: ${req.body.lifeExpectancy}`);
            console.log(`👨‍👩‍👧‍👦 Crecimiento poblacional: ${req.body.populationGrowth}`);
            
            nationString = await generateNationAdvancedGemini(
                req.body.nationName,
                req.body.governmentType,
                req.body.age,
                req.body.leaderName,
                req.body.politicalStability,
                req.body.economicSystem,
                req.body.currencyName,
                req.body.wealthDistribution,
                req.body.lifeExpectancy,
                req.body.populationGrowth,
                req.body.other,
            );
        } else {
            nationString = await generateNationGemini(req.body.nationName, req.body.governmentType, req.body.age);
        }
        
        console.log(`✅ Generación de JSON completada`);
        const nationJSON = JSON.parse(nationString);
        
        console.log(`📝 Resumen de la nación generada:`);
        console.log(`🏛️ Nombre: ${nationJSON.name}`);
        console.log(`📜 Contexto histórico: ${nationJSON.historicalContext.substring(0, 50)}...`);
        console.log(`🌐 Contexto geopolítico: ${nationJSON.geopoliticalContext.substring(0, 50)}...`);
        console.log(`🗳️ Detalles políticos: ${Object.keys(nationJSON.politicsDetails).length} atributos`);
        console.log(`💹 Detalles económicos: ${Object.keys(nationJSON.economyDetails).length} atributos`);
        console.log(`👥 Detalles demográficos: ${Object.keys(nationJSON.populationDetails).length} atributos`);
        
        console.log(`🔍 Validando y corrigiendo datos antes de guardar...`);
        
        // 1. Corregir fechas en eventos
        if (nationJSON.events && nationJSON.events.length > 0) {
            console.log(`📅 Corrigiendo formato de fechas en ${nationJSON.events.length} eventos...`);
            nationJSON.events = nationJSON.events.map(event => {
                // Si la fecha tiene formato incorrecto (año negativo), la formateamos adecuadamente
                if (event.date && event.date.match(/^-\d+/)) {
                    const yearMatch = event.date.match(/^-(\d+)/);
                    if (yearMatch) {
                        const year = yearMatch[1];
                        // Formato correcto para años anteriores a nuestra era: AñoBC
                        event.date = `${year}BC-01-01`;
                        console.log(`📅 Fecha corregida: de ${yearMatch[0]}-01-01 a ${event.date}`);
                    }
                }
                return event;
            });
        }
        
        // 2. Asegurar campos requeridos en languages
        if (nationJSON.populationDetails && nationJSON.populationDetails.languages) {
            console.log(`🔤 Asegurando campos requeridos en ${nationJSON.populationDetails.languages.length} idiomas...`);
            nationJSON.populationDetails.languages = nationJSON.populationDetails.languages.map(lang => {
                if (!lang.status) {
                    lang.status = lang.usage || "Oficial";
                    console.log(`🔤 Agregado status a idioma ${lang.name || lang.languageName}: ${lang.status}`);
                }
                return lang;
            });
        }
        
        // 3. Asegurar campos requeridos en religions
        if (nationJSON.populationDetails && nationJSON.populationDetails.religions) {
            console.log(`⛪ Asegurando campos requeridos en ${nationJSON.populationDetails.religions.length} religiones...`);
            nationJSON.populationDetails.religions = nationJSON.populationDetails.religions.map(religion => {
                if (!religion.influence) {
                    // Determinar influence en base al porcentaje si está disponible
                    const percent = parseFloat(religion.percentage || religion.percentageAdherents || "0");
                    if (percent > 50) {
                        religion.influence = "Alta";
                    } else if (percent > 20) {
                        religion.influence = "Media";
                    } else {
                        religion.influence = "Baja";
                    }
                    console.log(`⛪ Agregado influence a religión ${religion.name || religion.religionName}: ${religion.influence}`);
                }
                return religion;
            });
        }
        
        // 4. Asegurar growthRate si no existe
        if (nationJSON.populationDetails && !nationJSON.populationDetails.growthRate) {
            nationJSON.populationDetails.growthRate = nationJSON.populationDetails.populationGrowthRate || "1.5%";
            console.log(`👨‍👩‍👧‍👦 Agregado growthRate: ${nationJSON.populationDetails.growthRate}`);
        }
        
        console.log(`💾 Guardando nación en la base de datos...`);
        const newNation = new Nation({
            ...nationJSON,
            populationDetails: {
                population: nationJSON.populationDetails,
            },
            creator: req.body.userId,
        });
        
        const savedNation = await newNation.save();
        console.log(`✨ Nación guardada con éxito. ID: ${savedNation._id}`);
        console.log(`🌏 Nación generada: ${savedNation.name}`);
        res.send({ msg: "Nation created successfully", nation: savedNation });
    } catch (error) {
        console.error(`❌ Error al crear nación:`, error);
        res.send(
            { msg: "Error creating nation" }
        );
    }
}

const createRandomNation = async (req, res) => {
    try {
        console.log(`🌏 Iniciando generación aleatoria de nación...`);
        console.log(`🎲 Generando parámetros aleatorios...`);
        
        console.log(`⏳ Solicitando generación aleatoria de nación...`);
        const nationString = await generateNationRandomGemini();
        console.log(`✅ Generación de JSON completada`);
        
        const nationJSON = JSON.parse(nationString);
        
        console.log(`📝 Resumen de la nación aleatoria generada:`);
        console.log(`🏛️ Nombre: ${nationJSON.name}`);
        console.log(`🌐 Tipo de gobierno: ${nationJSON.politicsDetails.governmentType || 'No especificado'}`);
        console.log(`📜 Contexto histórico: ${nationJSON.historicalContext.substring(0, 50)}...`);
        console.log(`🌐 Contexto geopolítico: ${nationJSON.geopoliticalContext.substring(0, 50)}...`);
        console.log(`🗳️ Detalles políticos: ${Object.keys(nationJSON.politicsDetails).length} atributos`);
        console.log(`💹 Detalles económicos: ${Object.keys(nationJSON.economyDetails).length} atributos`);
        console.log(`👥 Detalles demográficos: ${Object.keys(nationJSON.populationDetails).length} atributos`);
        
        console.log(`🔍 Validando y corrigiendo datos antes de guardar...`);
        
        // 1. Corregir fechas en eventos
        if (nationJSON.events && nationJSON.events.length > 0) {
            console.log(`📅 Corrigiendo formato de fechas en ${nationJSON.events.length} eventos...`);
            nationJSON.events = nationJSON.events.map(event => {
                // Si la fecha tiene formato incorrecto (año negativo), la formateamos adecuadamente
                if (event.date && event.date.match(/^-\d+/)) {
                    const yearMatch = event.date.match(/^-(\d+)/);
                    if (yearMatch) {
                        const year = yearMatch[1];
                        // Formato correcto para años anteriores a nuestra era: AñoBC
                        event.date = `${year}BC-01-01`;
                        console.log(`📅 Fecha corregida: de ${yearMatch[0]}-01-01 a ${event.date}`);
                    }
                }
                return event;
            });
        }
        
        // Adaptando la estructura de populationDetails para que coincida con el esquema
        if (nationJSON.populationDetails && !nationJSON.populationDetails.population) {
            console.log(`🔄 Adaptando estructura de populationDetails al esquema para nación aleatoria...`);
            
            // 2. Asegurar campos requeridos en languages
            if (nationJSON.populationDetails.languages) {
                console.log(`🔤 Asegurando campos requeridos en ${nationJSON.populationDetails.languages.length} idiomas...`);
                nationJSON.populationDetails.languages = nationJSON.populationDetails.languages.map(lang => {
                    if (!lang.status) {
                        lang.status = lang.usage || "Oficial";
                        console.log(`🔤 Agregado status a idioma ${lang.name || lang.languageName}: ${lang.status}`);
                    }
                    return lang;
                });
            }
            
            // 3. Asegurar campos requeridos en religions
            if (nationJSON.populationDetails.religions) {
                console.log(`⛪ Asegurando campos requeridos en ${nationJSON.populationDetails.religions.length} religiones...`);
                nationJSON.populationDetails.religions = nationJSON.populationDetails.religions.map(religion => {
                    if (!religion.influence) {
                        // Determinar influence en base al porcentaje si está disponible
                        const percent = parseFloat(religion.percentage || religion.percentageAdherents || "0");
                        if (percent > 50) {
                            religion.influence = "Alta";
                        } else if (percent > 20) {
                            religion.influence = "Media";
                        } else {
                            religion.influence = "Baja";
                        }
                        console.log(`⛪ Agregado influence a religión ${religion.name || religion.religionName}: ${religion.influence}`);
                    }
                    return religion;
                });
            }
            
            // 4. Asegurar growthRate si no existe
            if (!nationJSON.populationDetails.growthRate) {
                nationJSON.populationDetails.growthRate = nationJSON.populationDetails.populationGrowthRate || "1.5%";
                console.log(`👨‍👩‍👧‍👦 Agregado growthRate: ${nationJSON.populationDetails.growthRate}`);
            }
            
            nationJSON.populationDetails = {
                population: nationJSON.populationDetails
            };
            console.log(`✅ Estructura adaptada correctamente`);
        }
        
        console.log(`💾 Guardando nación aleatoria en la base de datos...`);
        const newNation = new Nation({
            ...nationJSON,
            creator: req.body.userId,
        });
        const savedNation = await newNation.save();
        console.log(`✨ Nación aleatoria guardada con éxito. ID: ${savedNation._id}`);
        console.log(`🌏 Nación aleatoria generada: ${savedNation.name}`);
        res.send({ msg: "Nation created successfully", nation: savedNation });
    } catch (error) {
        console.error(`❌ Error al crear nación aleatoria:`, error);
        res.status(500).send(
            { msg: "Error creating random nation", error: error.message }
        );
    }
}

const addEvent = async (req, res) => {
    try {
        const nationId = req.params.nationId; // Cambiado de req.query.nationId
        const eventData = req.body;

        const nation = await Nation.findById(nationId);

        if (!nation) {
            return res.status(404).json({ message: 'Nación no encontrada' });
        }

        const newEvent = new Event(eventData)
        nation.events.push(newEvent);
        await nation.save();

        res.status(200).json(nation);
    } catch (error) {
        console.error('Error al añadir evento a la nación:', error);
        res.status(500).json({ message: 'Error interno del servidor', error });
    }
}

// METODOS DELETE
const deleteNation = async (req, res) => {
    try {
        const nationId = req.params.id; // Obtener el ID de los parámetros de la URL
        console.log(`🌏 Eliminando nación con ID: ${nationId}`);
        const nation = await Nation.findById(nationId);

        if (!nation) {
            return res.status(404).json({
                message: 'Nación no encontrada'
            });
        }

        // Verificar si el usuario que intenta eliminar es el creador
        if (nation.creator !== req.body.userId) {
            return res.status(403).json({
                message: 'No tienes permisos para eliminar esta nación'
            });
        }

        await Nation.findByIdAndDelete(nationId);
        console.log(`🌏 Nación eliminada: ${nation.name}`);
        res.status(200).json({
            message: 'Nación eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar la nación:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// METODOS PUT
const updateNation = async (req, res) => {
    try {
        const nationId = req.params.id;
        const updates = req.body;

        // Buscar la nación
        const nation = await Nation.findById(nationId);

        if (!nation) {
            return res.status(404).json({
                message: 'Nación no encontrada'
            });
        }

        // Verificar si el usuario que intenta editar es el creador
        if (nation.creator !== updates.userId) {
            return res.status(403).json({
                message: 'No tienes permisos para editar esta nación'
            });
        }

        // Validar campos que se pueden actualizar
        const allowedUpdates = [
            'name',
            'historicalContext',
            'geopoliticalContext',
            'politics',
            'population',
            'historicalCuriosities',
            'importantCharacters',
            'politicsDetails',
            'economyDetails',
            'populationDetails'
        ];

        // Filtrar solo los campos permitidos
        const filteredUpdates = Object.keys(updates)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = updates[key];
                return obj;
            }, {});

        // Actualizar la nación
        const updatedNation = await Nation.findByIdAndUpdate(
            nationId,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Nación actualizada exitosamente',
            nation: updatedNation
        });
    } catch (error) {
        console.error('Error al actualizar la nación:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

export {
    getNations,
    getNationsUser,
    getNationsUserSimple,
    getNationDetails,
    //createNation,
    createNationGemini,
    createRandomNation,
    addEvent,
    deleteNation,
    updateNation
}