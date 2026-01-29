import { generateNation, generateNationAdvanced } from "../config/newgemini.js";

const createNation = async (req, res) => {
  try {
    const { nationConcept, governmentType, age } = req.body;
    var nationString = await generateNation(nationConcept, governmentType, age);

    const nationJson = JSON.parse(nationString);

    res.send(nationJson);
  } catch (error) {
    console.error(`❌ Error al crear nación:`, error);
    res.send({ msg: "Error creating nation" });
  }
};

const createNationAdvanced = async (req, res) => {
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
};

export { createNation, createNationAdvanced };
