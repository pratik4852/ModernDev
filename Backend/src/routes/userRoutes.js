const router = require("express").Router();

const {
  getuser,
  adduser,
  deleteuser,
  updateuser,
  getGenderList,
} = require("../controllers/usercontroller");

router.get("/getuser", getuser);
router.post("/adduser", adduser);
router.delete("/deleteuser/:id",deleteuser);
router.put("/updateuser/:id",updateuser);
router.get("/gender-list", getGenderList);
module.exports = router;