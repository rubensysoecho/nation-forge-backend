import mongoose from "mongoose";
import generateId from "../helpers/generateId.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        default: generateId()
    },
    verified: {
        type: Boolean,
        default: false
    },
});

const User = mongoose.model("User", userSchema);
export default User;