import express from "express";
import IngredientRequest from "../models/IngredientRequest.js";

const router = express.Router();

// Create request
router.post("/", async (req, res) => {
  try {
    const { branch, ingredient, quantity } = req.body;
    const newReq = await IngredientRequest.create({ branch, ingredient, quantity });
    res.json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View all requests (admin)
router.get("/", async (req, res) => {
  try {
    const requests = await IngredientRequest.find()
      .populate("branch")
      .populate("ingredient");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
