const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const Branch = require("../models/Branch.js");
const router = express.Router();


// ✅ Only Admin can create, edit, delete
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ message: "Branch not found" });
    res.json({ message: "Branch deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Both Admin & User can view branches
router.get("/", authMiddleware, async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
