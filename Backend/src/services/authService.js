const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupService = async (data) => {
  const { username, email, gender, password } = data;

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
  });

  return user;
};

const signinService = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(
    password,
    user.password
  );

  if (!match) {
    throw new Error("Wrong password");
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user,
  };
};

module.exports = {
  signupService,
  signinService,
};