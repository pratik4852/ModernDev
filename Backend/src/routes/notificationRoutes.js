const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");
const upload = require("../middleware/upload");

router.post(
  "/notification",
  upload.single("image"), // 👈 ADD THIS
  controller.create,
);

router.get("/notification", controller.getAll);
router.get("/notification/:id", controller.getById);
router.put("/notification/:id", upload.single("image"), controller.update);
router.delete("/notification/:id", controller.remove);
router.get("/:id", controller.getById);
router.put("/:id", upload.single("image"), controller.update);
router.delete("/:id", controller.remove);
router.patch("/toggle/:id", controller.toggle);

module.exports = router;
