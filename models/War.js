const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schema for equipment (reusable for army, navy, air force)
const EquipmentSchema = new Schema({
  type: { type: String, required: true },
  models: [{ type: String }],
  quantities: [{ type: Schema.Types.Mixed }], // Allows for numbers or strings
}, { _id: false }); // Prevent Mongoose from creating an _id for each equipment item

// Sub-schema for forces involved in a battle
const ForcesInvolvedSchema = new Schema({
    country: {type: String, required: true},
    units: [{ type: String }] // Array of unit names
}, { _id: false });

// Main Simulation Schema
const SimulationSchema = new Schema({
  title: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  introduction: {
    countries: [{ type: String, required: true }],
    start_year: { type: Number, required: true },
    trigger: {
      type: { type: String, required: true },
      description: { type: String, required: true },
      details: { type: String, required: true }
    },
    simulation_duration: { type: String, required: true }
  },
  country_analysis: [{
    country: { type: String, required: true },
    armed_forces: {
      active_personnel: { type: Number },
      reserve_personnel: { type: Number },
      defense_budget: { type: String },
      main_suppliers: [{ type: String }],
      military_doctrine: { type: String },
      equipment: {
        army: [EquipmentSchema],
        navy: [EquipmentSchema],
        air_force: [EquipmentSchema]
      }
    },
    geography: {
      borders: [{ type: String }],
      terrain: [{ type: String }],
      key_infrastructure: [{ type: String }],
      major_cities: [{ type: String }]
    },
    economy: {
      gdp: { type: String },
      main_industries: [{ type: String }],
      natural_resources: [{ type: String }],
      import_dependency: [{ type: String }]
    },
    alliances: [{ type: String }],
    morale_and_support:{
        troop_morale: {type: String},
        public_support: {type: String}
    }
  }],
  simulation_development: {
    phases: [{
      name: { type: String, required: true },
      days: { type: String, required: true },
      events: [{
        day: { type: Number, required: true },
        description: { type: String, required: true }
      }]
    }]
  },
  battle_simulations: [{
    name: { type: String, required: true },
    day: { type: Number, required: true },
    location: { type: String, required: true },
    forces_involved: [ForcesInvolvedSchema], // Array of ForcesInvolvedSchema
    objectives: {
      type: Map,  // Using a Map to store objectives for any number of sides
      of: String, // Values are strings (objectives)
    },
    tactics: {
      type: Map, // Similar to objectives, using Map for flexibility
      of: String
    },
    result: { type: String },
    casualties: {
        type: Map,
        of: {
            killed: {type: Number},
            wounded: {type: Number},
            equipment_destroyed: {type: Schema.Types.Mixed}
        }
    },
    consequences: { type: String }
  }],
  non_military_events: [{
    type: { type: String, required: true },
    description: { type: String, required: true }
  }],
  narrative_fragments: [{
    character: { type: String, required: true },
    day: { type: Number, required: true },
    fragment: { type: String, required: true }
  }],
  conclusion: {
    conflict_resolution: { type: String },
    consequences: {
      human_losses: { type: String },
      political_consequences: { type: String }
    }
  }
});

module.exports = SimulationSchema;