const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", router);
app.use(cookieParser());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   next();
// });

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
