import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    flavor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flavor",
      required: true,
    },
    unitsSold: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Sales", salesSchema);
