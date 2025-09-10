import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., Milk, Sugar, Cocoa
  },
  { timestamps: true }
);

export default mongoose.model("Ingredient", ingredientSchema);
