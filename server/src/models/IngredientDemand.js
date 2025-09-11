import mongoose from "mongoose";

const ingredientDemandSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    flavor: {
      type: String,
      required: true,
    },
    ingredient: {
      type: String,
      required: true,
    },
    qtyNeeded: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const IngredientDemand = mongoose.model("IngredientDemand", ingredientDemandSchema);
export default IngredientDemand;
