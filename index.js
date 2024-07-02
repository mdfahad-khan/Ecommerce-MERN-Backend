const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Ensure this is at the top
const connectDB = require("./config/db");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const app = express();

// Debugging to check if environment variables are loaded
console.log("FRONTEND_URLS:", process.env.FRONTEND_URLS);

const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(",")
  : [];

app.use((req, res, next) => {
  console.log(`Request from origin: ${req.headers.origin}`);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin, like mobile apps or curl requests
      if (!origin) return callback(null, true);
      // Check if the request origin is in the allowedOrigins array
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.options("*", cors()); // Enable pre-flight across-the-board

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
