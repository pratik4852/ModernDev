const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notifications = sequelize.define(
  "notifications",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
    },

    image: {
      type: DataTypes.STRING,
    },

    audience: {
      type: DataTypes.STRING,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "notification",
    timestamps: true,
  },
);

module.exports = Notifications;
