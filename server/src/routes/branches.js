// routes/branches.js
import express from "express";
import Branch from "../models/Branch.js";

const router = express.Router();

// ✅ Get all branches with city info
router.get("/", async (req, res) => {
  try {
    const branches = await Branch.find().populate("city");
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
