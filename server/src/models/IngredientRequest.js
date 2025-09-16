const mongoose = require("mongoose");

const IngredientRequestSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  city: { type: String, required: true },
  flavor: { type: String, required: true },
  ingredient: { type: String, required: true },
  qty: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending | approved | rejected
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("IngredientRequest", IngredientRequestSchema);
