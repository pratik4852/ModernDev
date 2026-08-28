const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Tickets = sequelize.define(
  "tickets",
  {
    ticket_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    appointment_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    cluster_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    priority: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "tickets",
    timestamps: true,
  },
);

module.exports = Tickets;
