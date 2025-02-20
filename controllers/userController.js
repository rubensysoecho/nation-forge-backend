import User from "../models/User.js";

const createUser = async (req, res) => {
    const { email } = req.body;

    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
        const error = new Error("The email" + email + " is already associated with other account");
        return res.status(400).send({ msg: error.message });   
    }
    
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.send(savedUser);
    } catch (error) {
        console.log(error);
        res.send({ msg: "Error creating user" });
    }
};

const userDetails = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.body.token });
        if (user) {
            res.send(user);
        } else {
            res.send({ msg: "Invalid token" });
        }
    } catch (error) {
        console.log(error);
        res.send({ msg: "Error getting user details" });
    }
};

const verifyUser = async (req, res) => {
    try {
        const user = await User.findOne({ token: req.params.token });
        if (user) {
            user.verified = true;
            await user.save();
            res.send({ msg: "User verified" });
        } else {
            const error = new Error("Invalid token");
            res.status(404).send({ msg: error.message });
        }
    } catch (err) {
        console.log(err);
        res.send({ msg: "Error verifying user. " + err });
    }
};

export { createUser, userDetails, verifyUser };