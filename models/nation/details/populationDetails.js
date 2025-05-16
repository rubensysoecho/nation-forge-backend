import mongoose from "mongoose";

const urbanRuralSplitSchema = new mongoose.Schema({
  urbanPercentage: { type: String, required: true },
  ruralPercentage: { type: String, required: true },
  majorCities: [{ type: String }],
});

const ageBracketSchema = new mongoose.Schema({
  bracket: { type: String, required: true },
  percentage: { type: String, required: true },
});

const ageDistributionSchema = new mongoose.Schema({
  medianAge: { type: String, required: true },
  ageBrackets: [ageBracketSchema],
  dependencyRatio: { type: String, required: true },
});

const ethnicGroupSchema = new mongoose.Schema({
  groupName: { type: String },
  percentage: { type: String, required: true },
  notes: { type: String }
});

const languageSchema = new mongoose.Schema({
  languageName: { type: String },
  percentageSpeakers: { type: String },
  status: { type: String, required: true }
});

const religionSchema = new mongoose.Schema({
  religionName: { type: String },
  percentageAdherents: { type: String },
  influence: { type: String, required: true }
});

const lifeExpectancySchema = new mongoose.Schema({
  male: { type: String, required: true },
  female: { type: String, required: true },
  overall: { type: String, required: true },
});

const healthCareSchema = new mongoose.Schema({
  infantMortalityRate: { type: String, required: true },
  accessToHealthcare: { type: String, required: true }
});

const migrationSchema = new mongoose.Schema({
  immigrationRate: { type: String, required: true },
  emigrationRate: { type: String, required: true },
  mainOriginsDestinations: { type: String, required: true }
});

const workforceDistributionSchema = new mongoose.Schema({
  sector: { type: String, required: true },
  percentage: { type: String, required: true },
  dominantProfessions: [{ type: String }],
});

// Esquema de población
const populationSchema = new mongoose.Schema({
  totalPopulation: { type: String, required: true },
  populationGrowthRate: { type: String, required: true },
  lifeExpectancy: lifeExpectancySchema,
  ethnicGroups: [ethnicGroupSchema],
  languages: [languageSchema],
  religions: [religionSchema],
  urbanRuralSplit: urbanRuralSplitSchema,
  ageDistribution: ageDistributionSchema,
  educationLevel: { type: String, required: true },
  literacyRate: { type: String }, // Añadido literacyRate
  populationDensity: { type: String }, // Añadido populationDensity
  health: healthCareSchema,
  migration: migrationSchema,
  workforceDistribution: [workforceDistributionSchema],
  socialClasses: { type: String, required: true },
});

// Esquema principal
const populationDetailsSchema = new mongoose.Schema({
  population: populationSchema
});

export { populationDetailsSchema };