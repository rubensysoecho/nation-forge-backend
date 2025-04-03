import mongoose, { Schema } from 'mongoose';
import { eventSchema } from './events/eventModel.js';
import { politicalDetailsSchema } from './details/politicalDetails.js';
import { economyDetailsSchema } from './details/economyDetails.js';
import { populationDetailsSchema } from './details/populationDetails.js';

const nationSchema = new Schema({
    id: {
        type: Schema.Types.UUID,
        default: () => new mongoose.Types.UUID(),
        unique: true,
        required: true
    },
    name: {
        type: String,
        maxLength: 255,
        required: true,
    },
    historicalContext: {
        type: String,
        default: "",
        trim: true
    },
    geopoliticalContext: {
        type: String,
        default: "",
        trim: true
    },
    politics: {
        type: String,
        default: "",
        trim: true
    },
    population: {
        type: String,
        default: "",
        trim: true
    },
    historicalCuriosities: {
        type: [String],
        default: []
    },
    importantCharacters: {
        type: [String],
        default: []
    },
    events: [eventSchema],
    politicsDetails: {
        type: politicalDetailsSchema,
        required: true
    },
    economyDetails: {
        type: economyDetailsSchema,
        required: true
    },
    populationDetails: {
        type: populationDetailsSchema,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: String,
        required: true
    }
});

const Nation = mongoose.model("Nation", nationSchema);
export default Nation;