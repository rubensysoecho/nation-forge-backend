import mongoose from "mongoose";

// Subesquemas
const keySectorSchema = new mongoose.Schema({
  sectorName: { type: String, required: true },
  importance: { type: String, required: true },
});

const currencySchema = new mongoose.Schema({
  currencyName: { type: String, required: true },
  currencySymbol: { type: String },
  stability: { type: String, required: true },
});

const naturalResourceSchema = new mongoose.Schema({
  resourceName: { type: String, required: true },
  abundance: { type: String, required: true },
});

const economicLawSchema = new mongoose.Schema({
  propertyRights: { type: String, required: true },
  contractLaw: { type: String, required: true },
  taxSystem: { type: String, required: true },
  regulationLevel: { type: String, required: true },
});

const tradeAgreementSchema = new mongoose.Schema({
  partnerNation: { type: String, required: true },
  agreementType: { type: String, required: true },
});

const tradePolicySchema = new mongoose.Schema({
  openness: { type: String, required: true },
  majorExports: [{ type: String }],
  majorImports: [{ type: String }],
  tariffs: { type: String, required: true },
  tradeAgreements: [tradeAgreementSchema],
});

const infrastructureSchema = new mongoose.Schema({
  transportation: { type: String, required: true },
  energy: { type: String, required: true },
  communication: { type: String, required: true },
});

const laborForceSchema = new mongoose.Schema({
  sizeEstimate: { type: String, required: true },
  skillLevel: { type: String, required: true },
  unemploymentRate: { type: String, required: true },
  dominantIndustries: [{ type: String }],
});

// Esquema principal
const economyDetailsSchema = new mongoose.Schema({
  economicSystem: { type: String, required: true },
  keySectors: [keySectorSchema],
  currency: currencySchema,
  naturalResources: [naturalResourceSchema],
  economicLaw: economicLawSchema,
  tradePolicy: tradePolicySchema,
  infrastructure: infrastructureSchema,
  laborForce: laborForceSchema,
  wealthDistribution: { type: String, required: true },
  economicStability: { type: String, required: true },
  inflationRate: { type: String, required: true },
});

export { economyDetailsSchema };