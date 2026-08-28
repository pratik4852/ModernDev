const { SurveyQuestion, QuestionOption } = require("../models");

const addQuestion = async (surveyId, data) => {
  const { question, question_type, options } = data;

  const newQuestion = await SurveyQuestion.create({
    survey_id: surveyId,
    question,
    question_type,
  });

  // save options if exists
  if (
    options &&
    Array.isArray(options) &&
    options.length > 0
  ) {
    const optionData = options.map((item) => ({
      question_id: newQuestion.id,
      option_text: item,
    }));

    await QuestionOption.bulkCreate(optionData);
  }

  return await getQuestionById(newQuestion.id);
};

const getQuestionsBySurvey = async (surveyId) => {
  return await SurveyQuestion.findAll({
    where: {
      survey_id: surveyId,
    },
    include: [
      {
        model: QuestionOption,
      },
    ],
    order: [["id", "DESC"]],
  });
};

const getQuestionById = async (id) => {
  return await SurveyQuestion.findOne({
    where: { id },
    include: [
      {
        model: QuestionOption,
      },
    ],
  });
};

const updateQuestion = async (id, data) => {
  const question = await SurveyQuestion.findByPk(id);

  if (!question) {
    throw new Error("Question not found");
  }

  await question.update({
    question: data.question,
    question_type: data.question_type,
  });

  // remove old options
  await QuestionOption.destroy({
    where: {
      question_id: id,
    },
  });

  // add new options
  if (
    data.options &&
    Array.isArray(data.options)
  ) {
    const optionData = data.options.map((item) => ({
      question_id: id,
      option_text: item,
    }));

    await QuestionOption.bulkCreate(optionData);
  }

  return await getQuestionById(id);
};

const deleteQuestion = async (id) => {
  await QuestionOption.destroy({
    where: {
      question_id: id,
    },
  });

  return await SurveyQuestion.destroy({
    where: { id },
  });
};

module.exports = {
  addQuestion,
  getQuestionsBySurvey,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};