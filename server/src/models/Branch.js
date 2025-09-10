import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
    name: { type: String, required: true }, // e.g., Hasthampatti
  },
  { timestamps: true }
);

export default mongoose.model("Branch", branchSchema);
