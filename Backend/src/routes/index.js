const router = require("express").Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const notificationsRoutes = require("./notificationRoutes");
const lmsRoutes = require("./lmsRoutes");
const householdRoutes = require("./householdRoutes");
const ticketRoutes = require("./ticketsRoutes");
const surveyRoutes = require("./surveyRoutes");
const audienceRoutes = require("./audienceRoutes");
const settingsRoutes = require("./settingsRoutes");
const feedbackRoutes = require("./feedbackRoutes");
const memberRoutes = require("./memberRoutes");
const paymentRoutes = require("./paymentRoutes");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/lms", lmsRoutes);
router.use("/households", householdRoutes);
router.use("/tickets", ticketRoutes);
router.use("/surveys", surveyRoutes);
router.use("/audience", audienceRoutes);
router.use("/settings", settingsRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/members", memberRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
