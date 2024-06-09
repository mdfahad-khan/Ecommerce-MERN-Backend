const userModel = require("../../models/usermodel");


async function allUsers(req, res) {
  try {
    console.log("allUsers", req.userId);
    const allUser = await userModel.find();

    res.json({
      message: "All users",
      data: allUser,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: true,
    });
  }
}
module.exports = allUsers;
