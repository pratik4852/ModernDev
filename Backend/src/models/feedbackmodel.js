const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const household = require("./householdsmodel");
const user = require("./Users");

const Feedback = sequelize.define(
  "Feedback",
  {
    household: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: household,
        key: "id",
      },
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: user,
        key: "id",
      },
    },
    appointmentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "feedback",
    timestamps: true,
  }
);

module.exports = Feedback;
