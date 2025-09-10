import mongoose from "mongoose";

const flavorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., Vanilla, Chocolate
  },
  { timestamps: true }
);

export default mongoose.model("Flavor", flavorSchema);
