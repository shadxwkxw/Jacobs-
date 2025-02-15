const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Block = sequelize.define("Block", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    photoURL: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rightText1: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rightText2: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Block;