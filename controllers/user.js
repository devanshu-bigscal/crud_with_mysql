const userModel = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.createUser = async (req, res) => {
    try {
        const { name, age, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newUser = await userModel.create({
            name,
            age,
            email,
            password: hash,
        });

        return res.json({ message: "user created successfully", newUser });
    } catch (error) {
        console.log(error);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.findAll({});
        if (!users && !users instanceof Array) {
            throw new Error("Users not found");
        }
        return res.json(users);
    } catch (error) {
        console.log("Error whilt fetching users =>", error);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await userModel.findOne({ where: { id: req.params.id } });

        if (!user) throw new Error("User not found");

        return res.json(user);
    } catch (error) {
        console.log("Error while fetching user", error);
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const user = await userModel.destroy({ where: { id: req.params.id } });

        if (!user) throw new Error("User not found");

        return res.json({ message: "user deleted successfully", user });
    } catch (error) {
        console.log("Error while deleting user", error);
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const user = await userModel.update(req.body, {
            where: { id: req.params.id },
        });

        return res.json({ message: "user updated successfully", user });
    } catch (error) {
        console.log("Error while updating user", error);
    }
};

exports.validationCreate = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .required(),
        password: Joi.string()
            .min(6)
            .max(12)
            .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
            .required(),
        age: Joi.number().integer(),
    });

    try {
        const value = await schema.validateAsync(req.body);

        next();
    } catch (error) {
        const message = error.details.map((e) => e.message.replaceAll('"', ""));
        return res.json({ error: message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ where: { email: email } });

        if (!user) throw new Error("User not found");

        const value = await bcrypt.compare(password, user.password);

        if (!value) throw new Error("Email and Password do not match");

        const token = await jwt.sign(
            { decode_email: user.email, decode_name: user.name },
            process.env.SECRET_KEY
        );

        if (!token) throw new Error("Error while creating token");

        await user.setDataValue("token", token);

        return res.json({ message: "user logged in", user });
    } catch (error) {
        console.log(error);
    }
};

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split("Bearer")[1].trim();

        const user = await jwt.verify(token, process.env.SECRET_KEY);

        const { decode_email: user_email } = user;

        res.locals.user_email = user_email;
        next();
    } catch (error) {
        res.status(404).json({ message: "Authorization failed", error });
    }
};

exports.getUserByAuthentication = async (req, res) => {
    try {
        const user = await userModel.findOne({
            where: { email: res.locals.user_email },
        });

        if (!user) throw new Error("Authorize user not found");

        return res.json(user);
    } catch (error) {
        res.status(404).json({ message: "Error while fetching user", error });
    }
};
