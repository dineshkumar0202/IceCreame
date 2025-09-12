import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  flavor: { type: String, required: true },
  unitsSold: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;
