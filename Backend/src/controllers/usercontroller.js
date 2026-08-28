const {
  getuserService,
  adduserService,
  deleteuserService,
  updateuserService,
  getGenderListService,
} = require("../services/userService");

const getuser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const gender = req.query.gender || null;

    const data = await getuserService(
      page,
      limit,
      gender
    );

    res.json(data);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const adduser = async (req, res) => {
  try {
    const user = await adduserService(req.body);
    res.json({
      message: "User added",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteuser = async (req, res) => {
  try {
    await deleteuserService(req.params.id);
    res.json({
      message: "user deleted",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateuser = async (req, res) => {
  try {
    await updateuserService(req.params.id, req.body);
    res.json({
      message: "user Updated",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getGenderList = async (req, res) => {
  try {
    const list = await getGenderListService();

    res.json(list);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};



module.exports = {
  getuser,
  adduser,
  deleteuser,
  updateuser,
  getGenderList,
};
