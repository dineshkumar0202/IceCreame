import mongoose from "mongoose";

const ingredientRequestSchema = new mongoose.Schema({
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
  flavor: { type: String, required: true },
  ingredient: { type: String, required: true },
  qty: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const IngredientRequest = mongoose.model("IngredientRequest", ingredientRequestSchema);

export default IngredientRequest;
