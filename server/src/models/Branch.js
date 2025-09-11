import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  city: { type: String, required: true },
  area: { type: String, required: true },
});

export default mongoose.model("Branch", branchSchema);
