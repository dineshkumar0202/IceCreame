const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const Branch = require("../models/Branch");
const router = express.Router();


// ✅ Create new branch (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: "Error creating branch" });
  }
});

// ✅ Update branch (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: "Error updating branch" });
  }
});

// ✅ Delete branch (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ message: "Branch deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting branch" });
  }
});

// ✅ View all branches (Admin + User)
router.get("/", authMiddleware, async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
});

module.exports = router;
