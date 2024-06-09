

const bcrypt = require("bcryptjs");
const userModel = require("../../models/usermodel");

async function userSignUpController(req, res) {
  try {
    const { email, password, name } = req.body;

    const User = await userModel.findOne({ email });
    if (User) {
      throw new Error("User already exists ");
    }

    if (!email) {
      throw new Error("please provide email");
    }
    if (!password) {
      throw new Error("please provide password");
    }
    if (!name) {
      throw new Error("please provide name");
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Somethign wrong password");
    }
    const payload = {
      ...req.body,
      role: "GENERAL",
      password: hashPassword,
    };
    const userData = new userModel(payload);
    const saveUser = await userData.save();
    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User saved successfully",
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}
module.exports = userSignUpController;
