const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/usermodel");

const googleSignInController = async (req, res) => {
  try {
    const { email, name, googlePhotoUrl } = req.body;

    if (!email) {
      throw new Error("Email is required");
    }

    if (!name) {
      throw new Error("Name is required");
    }

    // Check if the user already exists
    let user = await userModel.findOne({ email });

    let token;
    let userData;

    if (user) {
      // If user exists, generate a JWT token
      const tokenData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        googlePhotoUrl: user.googlePhotoUrl,
      };

      token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8, // 8 hours
      });

      userData = tokenData;
    } else {
      // If user doesn't exist, create a new user
      const newUser = new userModel({
        name,
        email,
        googlePhotoUrl,
        password: await bcrypt.hash("defaultPassword", 10), // Create a default password, though it's not needed for Google sign-in
      });

      await newUser.save();

      // Generate a JWT token for the new user
      const tokenData = {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        googlePhotoUrl: newUser.googlePhotoUrl,
      };

      token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8, // 8 hours
      });

      userData = tokenData;
    }

    const tokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set Secure flag in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow cross-site cookies in production
    };

    // Store user data and token in cookies
    res.cookie("token", token, tokenOptions);
    res.cookie("userData", JSON.stringify(userData), tokenOptions);

    // Send user data and token as response
    res.json({
      message: user ? "Login Success" : "User created and login successful",
      data: {
        token,
        userData,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error in Google sign-in:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

module.exports = { googleSignInController };
