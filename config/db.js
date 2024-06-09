const mongoose = require("mongoose");

function connectDB() {
  return mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
    })
    .then(() => {
      console.log("Connected to Mongo");
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

module.exports = connectDB;
