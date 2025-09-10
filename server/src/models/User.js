import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    passwordHash: String,
    role: { type: String, enum: ["admin", "branch"], default: "branch" },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
