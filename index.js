const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Ensure this is at the top
const connectDB = require("./config/db");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const app = express();

// Parse FRONTEND_URLS from environment variable
const FRONTEND_URLS = process.env.FRONTEND_URLS.split(",");

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (FRONTEND_URLS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api", router);
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("connected to db");
      console.log(`server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
  });
