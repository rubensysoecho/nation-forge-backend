import mongoose from "mongoose";

// Subesquemas
const urbanRuralSplitSchema = new mongoose.Schema({
  urbanPercentage: { type: String, required: true },
  ruralPercentage: { type: String, required: true },
  majorCities: [{ type: String }],
});

const ageBracketSchema = new mongoose.Schema({
  bracket: { type: String, required: true },
  percentage: { type: String},
});

const ageDistributionSchema = new mongoose.Schema({
  medianAge: { type: String, required: true },
  ageBrackets: [ageBracketSchema],
  dependencyRatio: { type: String, required: true },
});

const ethnicGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  percentage: { type: String},
  notes: { type: String },
});

const languageSchema = new mongoose.Schema({
  languageName: { type: String, required: true },
  status: { type: String, required: true },
  percentageSpeakers: { type: String, required: true },
});

const religionSchema = new mongoose.Schema({
  religionName: { type: String, required: true },
  percentageAdherents: { type: String, required: true },
  influence: { type: String, required: true },
});

const lifeExpectancySchema = new mongoose.Schema({
  male: { type: String, required: true },
  female: { type: String, required: true },
  overall: { type: String, required: true },
});

const healthSchema = new mongoose.Schema({
  infantMortalityRate: { type: String, required: true },
  accessToHealthcare: { type: String, required: true },
});

const migrationSchema = new mongoose.Schema({
  immigrationRate: { type: String, required: true },
  emigrationRate: { type: String, required: true },
  mainOriginsDestinations: { type: String },
});

const workforceDistributionSchema = new mongoose.Schema({
  sector: { type: String, required: true },
  percentage: { type: String },
  dominantProfessions: [{ type: String }],
});

// Esquema de población
const populationSchema = new mongoose.Schema({
  totalPopulation: { type: String, required: true },
  populationDensity: { type: String, required: true },
  urbanRuralSplit: urbanRuralSplitSchema,
  ageDistribution: ageDistributionSchema,
  ethnicGroups: [ethnicGroupSchema],
  languages: [languageSchema],
  religions: [religionSchema],
  literacyRate: { type: String, required: true },
  educationLevel: { type: String, required: true },
  lifeExpectancy: lifeExpectancySchema,
  health: healthSchema,
  populationGrowthRate: { type: String, required: true },
  migration: migrationSchema,
  workforceDistribution: [workforceDistributionSchema],
  socialClasses: { type: String, required: true },
});

// Esquema principal
const populationDetailsSchema = new mongoose.Schema({
  population: populationSchema
});

export { populationDetailsSchema };