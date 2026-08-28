const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Household = require("./householdsmodel");

const Member = sequelize.define(
  "member",
  {
    memberId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    memberName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
    },

    earnedPoints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    userStatus: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },

    appVersion: {
      type: DataTypes.STRING,
      defaultValue: "-",
    },

    appStatus: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Inactive",
    },

    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    householdId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Household,
        key: "id",
      },
    },
  },
  {
    tableName: "member",
    timestamps: true,
  },
);

Household.hasMany(Member, {
  foreignKey: "householdId",
});

Member.belongsTo(Household, {
  foreignKey: "householdId",
});

module.exports = Member;
