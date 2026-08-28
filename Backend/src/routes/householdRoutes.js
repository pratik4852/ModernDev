const express = require("express");
const router = express.Router();
const householdController = require("../controllers/householdController");

router.post("/", householdController.createHousehold);
router.get("/", householdController.getAllHouseholds);
router.get("/:id", householdController.getHouseholdById);
router.put("/:id", householdController.updateHousehold);
router.delete("/:id", householdController.deleteHousehold);

module.exports = router;
