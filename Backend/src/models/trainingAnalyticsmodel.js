const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TrainingAnalytics = sequelize.define("TrainingAnalytics", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trainingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  completionStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = TrainingAnalytics;