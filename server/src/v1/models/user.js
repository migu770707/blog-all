//mongoDB_userShemaの構築
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  isAdmin: {
    type: String,
    required: true,
    select: false,
  },
});
module.exports = mongoose.model("User", userSchema);
