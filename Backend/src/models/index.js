const sequelize = require("../config/database");
const User = require("./Users");
const Tickets = require("./ticketsmodel");
const Audience = require("./audiencemodel");
const Settings = require("./settingsmodel");
const Household = require("./householdsmodel");
const Feedback = require("./feedbackmodel");
const Member = require("./membermodel");
const SurveyQuestion = require("./surveyquestionmodel");
const SurveyResponse = require("./surveyresponsemodal");
const QuestionOption = require("./questionoptionmodel");
const Survey = require("./surveymodal");

Tickets.belongsTo(User, {
  foreignKey: "assigned_to",
  as: "assignedUser",
});

User.hasMany(Tickets, {
  foreignKey: "assigned_to",
  as: "tickets",
});

Audience.belongsTo(User, {
  foreignKey: "userId",
  as: "mappedUser",
});

User.hasMany(Audience, {
  foreignKey: "userId",
  as: "audiences",
});

Settings.belongsTo(Audience, {
  foreignKey: "audienceId",
  as: "mappedAudience",
});

Audience.hasMany(Settings, {
  foreignKey: "audienceId",
  as: "settings",
});

Feedback.belongsTo(User, {
  foreignKey: "user",
  as: "mappedUser",
});

User.hasMany(Feedback, {
  foreignKey: "user",
  as: "feedback",
});

Feedback.belongsTo(Household, {
  foreignKey: "household",
  as: "mappedHousehold",
});

Household.hasMany(Feedback, {
  foreignKey: "household",
  as: "feedback",
});

Survey.hasMany(SurveyQuestion, {
  foreignKey: "survey_id",
});

SurveyQuestion.belongsTo(Survey, {
  foreignKey: "survey_id",
});

SurveyQuestion.hasMany(QuestionOption, {
  foreignKey: "question_id",
});

QuestionOption.belongsTo(SurveyQuestion, {
  foreignKey: "question_id",
});

SurveyQuestion.hasMany(SurveyResponse, {
  foreignKey: "question_id",
});

SurveyResponse.belongsTo(SurveyQuestion, {
  foreignKey: "question_id",
});

module.exports = {
  sequelize,
  User,
  Tickets,
  Audience,
  Settings,
  Household,
  Feedback,
  Survey,
  SurveyQuestion,
  QuestionOption,
  SurveyResponse,
  SurveyQuestions: SurveyQuestion,
  QuestionOptions: QuestionOption,
  SurveyResponses: SurveyResponse,
};
