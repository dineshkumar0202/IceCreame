import express from "express";
import {
  createIngredientDemand,
  getIngredientDemands,
  updateIngredientDemand,
  deleteIngredientDemand,
} from "../controllers/ingredientController.js";

const router = express.Router();

router.post("/", createIngredientDemand); // Create new demand
router.get("/", getIngredientDemands); // Get all demands
router.put("/:id", updateIngredientDemand); // Update demand by ID
router.delete("/:id", deleteIngredientDemand); // Delete demand by ID

export default router;
