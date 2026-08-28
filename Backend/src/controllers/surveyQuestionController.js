const surveyQuestionService = require(
  "../services/surveyQuestionService"
);

const addQuestion = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const result =
      await surveyQuestionService.addQuestion(
        surveyId,
        req.body
      );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getQuestions = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const result =
      await surveyQuestionService.getQuestionsBySurvey(
        surveyId
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addQuestion,
  getQuestions,
};
