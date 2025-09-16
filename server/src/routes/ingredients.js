const express = require("express");
const router = express.Router();
const IngredientRequest = require("../models/IngredientRequest");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// ✅ Create request (Branch/User)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const request = new IngredientRequest({
      ...req.body,
      user: req.user.id,
      status: "pending",
      date: new Date(),
    });
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Error creating request" });
  }
});

// ✅ Get all requests (Admin) / own requests (Branch)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let requests;
    if (req.user.role === "admin") {
      requests = await IngredientRequest.find();
    } else {
      requests = await IngredientRequest.find({ branch: req.user.branch });
    }
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Error fetching requests" });
  }
});

// ✅ Update request status (Admin only)
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const request = await IngredientRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Error updating request status" });
  }
});

// ✅ Delete request (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await IngredientRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting request" });
  }
});

module.exports = router;
