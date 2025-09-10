import mongoose from "mongoose";

const ingredientRequestSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    quantity: { type: Number, required: true }, // e.g., 50 kg
    status: {
      type: String,
      enum: ["pending", "approved", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("IngredientRequest", ingredientRequestSchema);
