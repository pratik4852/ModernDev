const User = require("../models/Users");
const bcrypt = require("bcryptjs");

const getuserService = async (
  page = 1,
  limit = 10,
  gender = null
  ) => {
  const offset = (page - 1) * limit;
  let where = {};
  if (gender) {
    where.gender = gender;
  }
  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: ["id", "username", "email", "gender", "mobile", "createdAt"],
    limit,
    offset,
    order: [["id", "DESC"]],
  });

  return {
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
    users: rows,
  };
};

const adduserService = async (data) => {
  const { username, email, gender, password, mobile } = data;

  const userExist = await User.findOne({
    where: { email },
  });
  if (userExist) {
    throw new Error("User exists");
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    gender,
    password: hash,
    mobile,
  });
  return user;
};

const deleteuserService = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("User not found");
  }
  await user.destroy();
  return true;
};

// UPDATE USER
const updateuserService = async (id, data) => {
  const { username, email, gender, password, mobile } = data;
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error("User not found");
  }
  let hashPassword = user.password;
  if (password) {
    hashPassword = await bcrypt.hash(password, 10);
  }
  await user.update({
    username,
    email,
    gender,
    password: hashPassword,
    mobile,
  });

  return user;
};

const getGenderListService = async () => {
  return [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];
};

module.exports = {
  getuserService,
  adduserService,
  deleteuserService,
  updateuserService,
  getGenderListService,
};
