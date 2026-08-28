const Survey = require("../models/surveymodal");

const normalizeSurveyPayload = (data = {}) => {
  return {
    title: data.title?.trim(),
    description: data.description?.trim() || null,
    start_date: data.start_date || data.startDate,
    end_date: data.end_date || data.endDate,
    audience: data.audience || data.audienece || null,
  };
};

const validateSurveyPayload = (data) => {
  const requiredFields = ["title", "start_date", "end_date"];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length) {
    const error = new Error(
      `Missing required fields: ${missingFields.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }
};

const createSurvey = async (data) => {
  const normalizedData = normalizeSurveyPayload(data);
  validateSurveyPayload(normalizedData);
  return await Survey.create(normalizedData);
};

const getAllSurveys = async () => {
  return await Survey.findAll({
    order: [["id", "DESC"]],
  });
};

const getSurveyById = async (id) => {
  return await Survey.findByPk(id);
};

const updateSurvey = async (id, data) => {
  const survey = await Survey.findByPk(id);

  if (!survey) {
    throw new Error("Survey not found");
  }

  const normalizedData = normalizeSurveyPayload({
    ...survey.toJSON(),
    ...data,
  });
  validateSurveyPayload(normalizedData);

  await survey.update(normalizedData);
  return survey;
};

const deleteSurvey = async (id) => {
  const deletedCount = await Survey.destroy({
    where: { id },
  });

  if (!deletedCount) {
    throw new Error("Survey not found");
  }

  return true;
};

module.exports = {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
};
