const surveyResponseService = require("../services/surveyResponseservice");

const submitResponse = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const result = await surveyResponseService.submitResponse(
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

const getResponses = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const result = await surveyResponseService.getResponses(surveyId);

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
  submitResponse,
  getResponses,
};
