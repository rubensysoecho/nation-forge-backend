import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    smth: {
        type: String,
        required: true
    }
});

const NationTest = mongoose.model("NationTest", testSchema);
export default NationTest;