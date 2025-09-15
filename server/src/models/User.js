const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String },
  role: { type: String, enum: ["admin", "user"], default: "user" }, // ✅ Add role
});

module.exports = mongoose.model("User", userSchema);
