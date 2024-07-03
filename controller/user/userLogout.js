async function userLogout(req, res, next) {
  try {
    const tokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set Secure flag in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow cross-site cookies in production
    };
    res.clearCookie("token", tokenOptions);
    res.json({
      message: "User logged out",
      error: false,
      success: true,
      data: [],
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}
module.exports = userLogout;
