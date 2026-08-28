const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), settingsController.createSettings);
router.get("/", settingsController.getAllSettings);
router.get("/:id", settingsController.getSettingsById);
router.put("/:id", upload.single("image"), settingsController.updateSettings);
router.delete("/:id", settingsController.deleteSettings);

module.exports = router;
