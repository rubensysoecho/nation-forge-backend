import mongoose from "mongoose";

// Subesquemas
const majorCitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  population: { type: String, required: true },
  significance: { type: String, required: true }
});

const urbanRuralDivideSchema = new mongoose.Schema({
  urbanPercentage: { type: String, required: true },
  ruralPercentage: { type: String, required: true },
  majorCities: [majorCitySchema],
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
  name: { type: String },
  groupName: { type: String },
  percentage: { type: String, required: true },
  details: { type: String },
  notes: { type: String }
});

const languageSchema = new mongoose.Schema({
  name: { type: String },
  languageName: { type: String },
  usage: { type: String },
  percentageSpeakers: { type: String },
  status: { type: String, required: true }
});

const religionSchema = new mongoose.Schema({
  name: { type: String },
  religionName: { type: String },
  percentage: { type: String },
  percentageAdherents: { type: String },
  influence: { type: String, required: true }
});

const lifeExpectancySchema = new mongoose.Schema({
  male: { type: String, required: true },
  female: { type: String, required: true },
  overall: { type: String, required: true },
});

const educationSchema = new mongoose.Schema({
  literacyRate: { type: String, required: true },
  educationSystem: { type: String, required: true },
  educationalInstitutions: [{ type: String }],
  educationLevel: { type: String, required: true }
});

const healthCareSchema = new mongoose.Schema({
  qualityLevel: { type: String, required: true },
  accessLevel: { type: String, required: true },
  majorChallenges: [{ type: String }],
  infantMortalityRate: { type: String, required: true },
  accessToHealthcare: { type: String, required: true }
});

const socialClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: String, required: true },
  economicStatus: { type: String, required: true },
  politicalInfluence: { type: String, required: true }
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
  growthRate: { type: String, required: true },
  populationGrowthRate: { type: String },
  lifeExpectancy: lifeExpectancySchema,
  ethnicGroups: [ethnicGroupSchema],
  languages: [languageSchema],
  religions: [religionSchema],
  urbanRuralDivide: urbanRuralDivideSchema,
  ageDistribution: ageDistributionSchema,
  education: educationSchema,
  healthCare: healthCareSchema,
  migration: migrationSchema,
  workforceDistribution: [workforceDistributionSchema],
  socialClasses: [socialClassSchema]
});

// Esquema principal
const populationDetailsSchema = new mongoose.Schema({
  population: populationSchema
});

export { populationDetailsSchema };