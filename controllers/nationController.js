import { generateNation } from "../config/gemini.js";

export const createNation = async (req, res) => {
  try {
    console.log(`🇬🇧 Iniciando generación de nación...`);
    const { nationConcept, governmentType, age } = req.body;
    var nationString = await generateNation(nationConcept, governmentType, age);

    const nationJson = nationString;

    res.send(nationJson);
    console.log(`🇬🇧✅ Nacion creada`);
  } catch (error) {
    console.error(`❌ Error al crear nación:`, error);
    res.send({ msg: "Error creating nation" });
  }
};

/*const createNationAdvanced = async (req, res) => {
  try {
    const {
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
    } = req.body;

    var nationString = await generateNationAdvanced(
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
    );

    const nationJson = JSON.parse(nationString);
    res.send(nationJson);
  } catch (error) {
    console.error(`❌ Error al crear nación:`, error);
    res.send({ msg: "Error creating nation" });
  }
};*/
