const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
  try {
    const cookieHeader = req.headers.cookie;
    const token = cookieHeader
      ? cookieHeader
          .split("; ")
          .find((row) => row.startsWith("token="))
          .split("=")[1]
      : null;

    if (!token) {
      console.log("No token found in request cookies");
      return res.status(200).json({
        message: "Please Login......",
        error: true,
        success: false,
      });
    }
    console.log("Token received: ", token);

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("Token verification failed:", err);
        return res.status(401).json({
          message: "Unauthorized",
          error: true,
          success: false,
        });
      }

      req.userId = decoded._id;
      next();
    });
  } catch (err) {
    console.log("Error in authToken middleware:", err);
    res.status(400).json({
      message: err.message || err,
      data: [],
      error: true,
      success: false,
    });
  }
}

module.exports = authToken;
