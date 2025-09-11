import IngredientDemand from "../models/IngredientDemand.js";

// ✅ Create Ingredient Request
export const createIngredientDemand = async (req, res) => {
  try {
    const { branch, flavor, ingredient, qtyNeeded } = req.body;

    if (!branch || !flavor || !ingredient || !qtyNeeded) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const demand = await IngredientDemand.create({
      branch,
      flavor,
      ingredient,
      qtyNeeded,
    });

    return res.status(201).json({
      message: "Ingredient demand created successfully",
      demand,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Ingredient Demands
export const getIngredientDemands = async (req, res) => {
  try {
    const demands = await IngredientDemand.find().populate("branch");
    return res.json(demands);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ✅ Update Ingredient Demand
export const updateIngredientDemand = async (req, res) => {
  try {
    const { id } = req.params;
    const { branch, flavor, ingredient, qtyNeeded } = req.body;

    const demand = await IngredientDemand.findByIdAndUpdate(
      id,
      { branch, flavor, ingredient, qtyNeeded },
      { new: true }
    );

    if (!demand) {
      return res.status(404).json({ message: "Demand not found" });
    }

    return res.json({ message: "Demand updated successfully", demand });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// ✅ Delete Ingredient Demand
export const deleteIngredientDemand = async (req, res) => {
  try {
    const { id } = req.params;
    const demand = await IngredientDemand.findByIdAndDelete(id);

    if (!demand) {
      return res.status(404).json({ message: "Demand not found" });
    }

    return res.json({ message: "Demand deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

