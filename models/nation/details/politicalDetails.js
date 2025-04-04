import mongoose from "mongoose";

// Subesquemas
const warDetailsSchema = new mongoose.Schema({
  nation: { type: String, required: true },
  date: { type: String, required: true },
  reason: { type: String, required: true },
  outcome: { type: String, required: true },
});

const allianceSchema = new mongoose.Schema({
  nation: { type: String, required: true },
  date: { type: String, required: true },
  purpose: { type: String, required: true },
});

const influenceSchema = new mongoose.Schema({
  nation: { type: String, required: true },
  type: { type: String, required: true },
  strength: { type: String, required: true },
});

const leaderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  rulingParty: { type: String },
  succession: { type: String, required: true },
});

const legislativeBranchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  structure: { type: String, required: true },
  powers: { type: String, required: true },
});

const judicialBranchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  structure: { type: String, required: true },
  powers: { type: String, required: true },
});

const separatismSchema = new mongoose.Schema({
  region: { type: String, required: true },
  demands: { type: String, required: true },
  strength: { type: String, required: true },
});

const tensionSchema = new mongoose.Schema({
  group: { type: String },
  religion: { type: String },
  party: { type: String },
  issue: { type: String, required: true },
  severity: { type: String, required: true },
});

// Esquema principal
const politicalDetailsSchema = new mongoose.Schema({
  exterior: {
    geopolitics: {
      wars: [warDetailsSchema],
      alliances: [allianceSchema]
    },
    influences: [influenceSchema]
  },
  interior: {
    governmentType: { type: String, required: true },
    leader: leaderSchema,
    legislativeBranch: legislativeBranchSchema,
    judicialBranch: judicialBranchSchema,
    politicalStability: { type: String, required: true },
    politicalIdeology: { type: String, required: true },
    separatism: [separatismSchema],
    tensions: {
      cultural: [tensionSchema],
      religious: [tensionSchema],
      political: [tensionSchema]
    }
  }
});

export { politicalDetailsSchema };