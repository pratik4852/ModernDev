const { Feedback, User, Household } = require("../models");

const userInclude = {
  model: User,
  as: "mappedUser",
  attributes: ["id", "username", "email", "gender", "mobile", "createdAt"],
};

const householdInclude = {
  model: Household,
  as: "mappedHousehold",
  attributes: ["id", "householdCode", "state", "district", "createdAt"],
};

const getSelectedId = (value, fallback) => {
  if (value && typeof value === "object") {
    return value.id;
  }

  return value ?? fallback;
};

const normalizeFeedbackPayload = (data = {}) => {
  return {
    household: getSelectedId(data.household, data.householdId),
    user: getSelectedId(data.user, data.userId),
    appointmentNumber: data.appointmentNumber?.trim(),
    rating: data.rating,
    message: data.message?.trim() || null,
  };
};

const validateFeedbackPayload = async (data) => {
  const requiredFields = ["household", "user", "appointmentNumber", "rating"];
  const missingFields = requiredFields.filter(
    (field) =>
      data[field] === undefined || data[field] === null || data[field] === ""
  );

  if (missingFields.length) {
    const error = new Error(
      `Missing required fields: ${missingFields.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const household = await Household.findByPk(data.household);
  if (!household) {
    const error = new Error("Household not found");
    error.statusCode = 404;
    throw error;
  }

  const user = await User.findByPk(data.user);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
};

const formatFeedback = (feedback) => {
  if (!feedback) return null;

  const data = feedback.toJSON();

  if (data.mappedUser) {
    data.user = data.mappedUser;
    delete data.mappedUser;
  }

  if (data.mappedHousehold) {
    data.household = data.mappedHousehold;
    delete data.mappedHousehold;
  }

  return data;
};

const createFeedback = async (data) => {
  const normalizedData = normalizeFeedbackPayload(data);
  await validateFeedbackPayload(normalizedData);

  const feedback = await Feedback.create(normalizedData);
  const result = await Feedback.findByPk(feedback.id, {
    include: [userInclude, householdInclude],
  });

  return formatFeedback(result);
};

const getAllFeedback = async () => {
  const feedback = await Feedback.findAll({
    include: [userInclude, householdInclude],
    order: [["id", "DESC"]],
  });

  return feedback.map(formatFeedback);
};

const getFeedbackById = async (id) => {
  const feedback = await Feedback.findByPk(id, {
    include: [userInclude, householdInclude],
  });

  return formatFeedback(feedback);
};

const getFeedbackFormOptions = async () => {
  const [households, users] = await Promise.all([
    Household.findAll({
      attributes: ["id", "householdCode", "state", "district", "createdAt"],
      order: [["id", "DESC"]],
    }),
    User.findAll({
      attributes: ["id", "username", "email", "gender", "mobile", "createdAt"],
      order: [["id", "DESC"]],
    }),
  ]);

  return {
    households,
    users,
  };
};

const updateFeedback = async (id, data) => {
  const feedback = await Feedback.findByPk(id);

  if (!feedback) {
    const error = new Error("Feedback not found");
    error.statusCode = 404;
    throw error;
  }

  const normalizedData = normalizeFeedbackPayload({
    ...feedback.toJSON(),
    ...data,
  });
  await validateFeedbackPayload(normalizedData);

  await feedback.update(normalizedData);

  const result = await Feedback.findByPk(id, {
    include: [userInclude, householdInclude],
  });

  return formatFeedback(result);
};

const deleteFeedback = async (id) => {
  const deletedCount = await Feedback.destroy({
    where: { id },
  });

  if (!deletedCount) {
    const error = new Error("Feedback not found");
    error.statusCode = 404;
    throw error;
  }

  return true;
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  getFeedbackFormOptions,
  updateFeedback,
  deleteFeedback,
};
