const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
    },

    gender: {
      type: DataTypes.STRING,
    },

    password: {
      type: DataTypes.STRING,
    },
    mobile:{
      type: DataTypes.STRING,
      unique: true,
      allowNull:true,
    }
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;