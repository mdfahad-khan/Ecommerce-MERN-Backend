const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Ensure this is at the top
const connectDB = require("./config/db");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const app = express();

// Debugging to check if environment variables are loaded

app.use(
  cors({
    origin: "https://ecommerce-mern-lovat-xi.vercel.app/",
    credentials: true,
  })
);

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
