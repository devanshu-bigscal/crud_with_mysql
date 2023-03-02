const { Sequelize, DataTypes, DATE } = require("sequelize");
const sequelize = require("../connections/db_connection");

const User = sequelize.define(
    "Users",
    {
        name: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        age: {
            type: DataTypes.INTEGER,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
    },
    {
        tablename: "Users",

    }
);

module.exports = User;
