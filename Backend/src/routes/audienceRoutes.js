const express = require("express");
const router = express.Router();
const audienceController = require("../controllers/audienceController");

router.post("/", audienceController.createAudience);
router.get("/", audienceController.getAllAudience);
router.get("/:id", audienceController.getAudienceById);
router.put("/:id", audienceController.updateAudience);
router.delete("/:id", audienceController.deleteAudience);

module.exports = router;
