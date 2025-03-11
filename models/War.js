import mongoose from "mongoose";

const warSchema = new mongoose.Schema({
    name: { type: String, required: true },
    aggressorCountry: {
        name: { type: String, required: true },
        troops: { type: String, required: true },
        advantages: [{ type: String }],
        disadvantages: [{ type: String }],
        equipment: [{ type: String }],
        casusBelli: { type: String, required: true }
    },
    defenderCountry: {
        name: { type: String, required: true },
        troops: { type: String, required: true },
        advantages: [{ type: String }],
        disadvantages: [{ type: String }],
        equipment: [{ type: String }]
    },
    warProgress: [{
        day: { type: String, required: true },
        events: [{ type: String, required: true }]
    }],
    soldierView: { type: String, required: true },
    kia: [{ type: String }],
    results: { type: String, required: true },
    winner: { type: String, required: true },
    creator: {
        type: String,
        required: true
    }
});

const War = mongoose.model('War', warSchema);

export default War