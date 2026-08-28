const {
  SurveyResponse,
  SurveyQuestion,
} = require("../models");

const submitResponse = async (
  surveyId,
  body
) => {
  const { user_id, answers } = body;

  const responseData = answers.map((item) => ({
    survey_id: surveyId,
    question_id: item.question_id,
    user_id,
    answer: item.answer,
  }));

  return await SurveyResponse.bulkCreate(
    responseData
  );
};

const getResponses = async (surveyId) => {
  return await SurveyResponse.findAll({
    where: {
      survey_id: surveyId,
    },
    include: [
      {
        model: SurveyQuestion,
      },
    ],
    order: [["id", "DESC"]],
  });
};

module.exports = {
  submitResponse,
  getResponses,
};