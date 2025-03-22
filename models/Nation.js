import mongoose from "mongoose";

/* const nationSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.UUID,
        default: () => new mongoose.Types.UUID(),
        unique: true,
        required: true
    },
    nationName: {
        type: String,
        maxLength: 255,
        default: null
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: String,
        required: true
    }
}); */


const nationSchema = new Schema({
    id: {
        type: Schema.Types.UUID,
        default: () => new mongoose.Types.UUID(),
        unique: true,
        required: true
    },
    name: {  // Changed from nation_name
        type: String,
        maxLength: 255,
        required: true, // Make name required
    },
    events: {
        type: [eventSchema],
        default: []
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