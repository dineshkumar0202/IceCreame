import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch", // must match your Branch model name
    required: true,
  },
  flavor: { type: String, required: true },
  unitsSold: { type: Number, required: true },
});

export default mongoose.model("Sale", saleSchema);
