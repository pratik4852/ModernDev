const surveyService = require("../services/surveyService");

const createSurvey = async (req, res) => {
  try {
    const data = req.body;
    const survey = await surveyService.createSurvey(data);

    res.status(201).json({
      success: true,
      data: survey,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllSurveys = async (req, res) => {
  try {
    const surveys = await surveyService.getAllSurveys();

    res.status(200).json({
      success: true,
      data: surveys,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSurveyById = async (req, res) => {
  try {
    const { id } = req.params;
    const survey = await surveyService.getSurveyById(id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    res.status(200).json({
      success: true,
      data: survey,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedSurvey = await surveyService.updateSurvey(id, data);

    res.status(200).json({
      success: true,
      data: updatedSurvey,
    });
  } catch (error) {
    res.status(error.statusCode || (error.message === "Survey not found" ? 404 : 500)).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.params;
    await surveyService.deleteSurvey(id);

    res.status(200).json({
      success: true,
      message: "Survey deleted successfully",
    });
  } catch (error) {
    res.status(error.message === "Survey not found" ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
};
