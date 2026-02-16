import { generateWar } from "../config/gemini.js";

export const createWar = async (req, res) => {
  try {
    console.log(`⚔️ Iniciando generación de guerra...`);
    const { aggressor, defender, casusBelli, age } = req.body;
    var warString = await generateWar(aggressor, defender, casusBelli, age);

    const warJson = warString;
    res.send(warJson);
    console.log(`⚔️✅ Guerra creada`);
  } catch (error) {
    console.error(`❌ Error al crear guerra:`, error);
    res.send({ msg: "Error creating war" });
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
