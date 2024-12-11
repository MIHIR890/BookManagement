const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String },
  profilePicUrl: { type: String },
});

const LogInCollection = mongoose.model("LoginCollection", userSchema);

module.exports = LogInCollection;
