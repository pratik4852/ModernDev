import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAddSurveyQuestionMutation,
  useGetSurveyQuestionsQuery,
  useAddSurveyResponseMutation,
  useGetSurveyResponseQuery,
} from "../redux/baseapi";

const AddSurvey = () => {
  const { surveyId } = useParams();
  const [activeTab, setActiveTab] = useState("addQuestion");

  // Question Form State
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionType, setQuestionType] = useState("text");

  // Response State
  const [answers, setAnswers] = useState({});

  // APIs
  const [addSurveyQuestion, { isLoading: addingQuestion }] =
    useAddSurveyQuestionMutation();

  const { data: questionsData, refetch: refetchQuestions } =
    useGetSurveyQuestionsQuery(surveyId, { skip: !surveyId });

  const [addSurveyResponse, { isLoading: submittingResponse }] =
    useAddSurveyResponseMutation();

  const { data: responsesData, refetch: refetchResponses } =
    useGetSurveyResponseQuery(surveyId, { skip: !surveyId });

  const questions = questionsData?.data || [];
  const responses = responsesData?.data || [];

  // Add Question
  const handleAddQuestion = async (e) => {
    e.preventDefault();

    try {
      await addSurveyQuestion({
        surveyId,
        body: {
          question: questionTitle,
          question_type: questionType,
        },
      }).unwrap();

      setQuestionTitle("");
      setQuestionType("text");

      refetchQuestions();
      alert("Question added successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to add question");
    }
  };

  // Handle Answer Change
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Submit Responses
  const handleSubmitResponse = async () => {
    try {
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        question_id: Number(questionId),
        answer: answers[questionId],
      }));

      await addSurveyResponse({
        surveyId,
        body: {
          user_id: 1,
          answers: formattedAnswers,
        },
      }).unwrap();

      setAnswers({});

      refetchResponses();

      alert("Response submitted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to submit response");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white shadow-lg">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-2xl font-bold text-slate-800">
            Survey Management
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("addQuestion")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "addQuestion"
                ? "border-b-2 border-indigo-600 bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Add Question
          </button>

          <button
            onClick={() => setActiveTab("responseQuestions")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "responseQuestions"
                ? "border-b-2 border-indigo-600 bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Response Questions
          </button>

          <button
            onClick={() => setActiveTab("surveyResponses")}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "surveyResponses"
                ? "border-b-2 border-indigo-600 bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Survey Responses
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Add Question Tab */}
          {activeTab === "addQuestion" && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-slate-800">
                Add Question
              </h2>

              <form className="space-y-6" onSubmit={handleAddQuestion}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Question Title
                  </label>

                  <input
                    type="text"
                    placeholder="Enter question"
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Question Type
                  </label>

                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    <option value="text">Text</option>
                    <option value="multiple_choice">
                      Multiple Choice
                    </option>
                    <option value="checkbox">Checkbox</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={addingQuestion}
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {addingQuestion ? "Saving..." : "Save Question"}
                </button>
              </form>
            </div>
          )}

          {/* Response Questions Tab */}
          {activeTab === "responseQuestions" && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-slate-800">
                Response Questions
              </h2>

              <div className="space-y-4">
                {questions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-5"
                  >
                    <p className="font-medium text-slate-800">
                      {item.question}
                    </p>

                    <div className="mt-4">
                      {item.question_type === "text" ? (
                        <input
                          type="text"
                          placeholder="Enter your answer"
                          value={answers[item.id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(item.id, e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                        />
                      ) : item.question_type === "rating" ? (
                        <select
                          value={answers[item.id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(item.id, e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                        >
                          <option value="">Select Rating</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter answer"
                          value={answers[item.id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(item.id, e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                        />
                      )}
                    </div>
                  </div>
                ))}

                {questions.length > 0 && (
                  <button
                    onClick={handleSubmitResponse}
                    disabled={submittingResponse}
                    className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submittingResponse
                      ? "Submitting..."
                      : "Submit Response"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Survey Responses Tab */}
          {activeTab === "surveyResponses" && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-slate-800">
                Survey Responses
              </h2>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        User ID
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Question
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Response
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {responses.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-200"
                      >
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.user_id}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.survey_question?.question}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {item.answer}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}

                    {responses.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-6 text-center text-sm text-slate-500"
                        >
                          No responses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSurvey;
