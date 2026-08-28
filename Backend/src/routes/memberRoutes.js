const express = require("express");
const router = express.Router();

const memberController = require("../controllers/memberController");
router.post("/", memberController.createMember);
router.get("/", memberController.getAllMembers);
router.get("/household/:householdId", memberController.getMembersByHousehold);
router.put("/:id", memberController.updateMember);
router.delete("/:id", memberController.deleteMember);
module.exports = router;
