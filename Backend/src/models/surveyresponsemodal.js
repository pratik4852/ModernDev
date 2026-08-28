const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SurveyResponse = sequelize.define(
  "survey_response",
  {
    survey_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "survey_responses",
    timestamps: true,
  }
);

module.exports = SurveyResponse;