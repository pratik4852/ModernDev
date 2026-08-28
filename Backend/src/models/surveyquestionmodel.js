const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SurveyQuestion = sequelize.define(
  "survey_question",
  {
    survey_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    question_type: {
      type: DataTypes.ENUM(
        "text",
        "radio",
        "checkbox",
        "dropdown",
        "textarea"
      ),
      allowNull: false,
    },
  },
  {
    tableName: "survey_questions",
    timestamps: true,
  }
);

module.exports = SurveyQuestion;