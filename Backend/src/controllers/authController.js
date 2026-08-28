const {
  signupService,
  signinService,
} = require("../services/authService");


// signup
const signup = async (req, res) => {
  try {
    const user = await signupService(req.body);

    res.json({
      message: "Signup success",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



// signin
const signin = async (req, res) => {
  try {
    const data = await signinService(req.body);

    res.json({
      message: "Login success",
      token: data.token,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = { signup, signin };