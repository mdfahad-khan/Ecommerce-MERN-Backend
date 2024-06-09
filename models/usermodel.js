// const mongoose = require("mongoose");

// const userSchema = new mongooseSchema(
//   {
//     name: String,
//     email: {
//       type: String,
//       unique: true,
//       required: true,
//     },
//     password: String,
//     profilePic: String,
//   },
//   {
//     timestsamps: true,
//   }
// );

// const userModel = mongoose.model("user", userSchema);
// module.exports = userModel;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    profilePic: String,
    role: String,
  },
  {
    timestamps: true, // Ensure this key is spelled correctly
  }
);

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
