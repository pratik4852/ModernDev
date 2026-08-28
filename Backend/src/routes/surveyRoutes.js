const express = require("express");
const router = express.Router();
const surveyController = require("../controllers/surveyController");
const surveyQuestionController = require("../controllers/surveyQuestionController");
const surveyResponseController = require("../controllers/surveyResponseController");

router.post("/", surveyController.createSurvey);
router.get("/", surveyController.getAllSurveys);
router.post("/:surveyId/questions", surveyQuestionController.addQuestion);
router.get("/:surveyId/questions", surveyQuestionController.getQuestions);
router.post("/:surveyId/responses", surveyResponseController.submitResponse);
router.get("/:surveyId/responses", surveyResponseController.getResponses);
router.get("/:id", surveyController.getSurveyById);
router.put("/:id", surveyController.updateSurvey);
router.delete("/:id", surveyController.deleteSurvey);

module.exports = router;
