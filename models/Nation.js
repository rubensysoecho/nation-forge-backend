import mongoose from "mongoose";

const nationSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.UUID,
        default: () => new mongoose.Types.UUID(),
        unique: true,
        required: true
    },
    nation_name: {
        type: String,
        maxLength: 255,
        default: null
    },
    historical_context: {
        type: String,
        default: "",
        trim: true
    },
    geopolitical_context: {
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
    historical_curiosities: {
        type: [String],
        default: []
    },
    important_characters: {
        type: [String],
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Nation = mongoose.model("Nation", nationSchema);
export default Nation;