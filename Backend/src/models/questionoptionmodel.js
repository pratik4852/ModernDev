const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const QuestionOption = sequelize.define(
  "question_option",
  {
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    option_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "question_options",
    timestamps: true,
  }
);

module.exports = QuestionOption;