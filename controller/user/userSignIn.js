const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/usermodel");

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Please enter an email");
    }

    if (!password) {
      throw new Error("Please enter a password");
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
      };

      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8, // 8 hours
      });

      const tokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only set Secure flag in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow cross-site cookies in production
      };

      res.cookie("token", token, tokenOptions).json({
        message: "Login Success",
        data: token,
        success: true,
        error: false,
      });
    } else {
      throw new Error("Please check the password");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(400).json({
      message: err.message || "An error occurred during login",
      error: true,
      success: false,
    });
  }
}

module.exports = userSignInController;
