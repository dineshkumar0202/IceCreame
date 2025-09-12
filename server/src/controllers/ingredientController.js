import IngredientRequest from "../models/IngredientDemand.js";

// ✅ Create new ingredient request
export const createRequest = async (req, res) => {
  try {
    const { branch, flavor, ingredient, qty } = req.body;

    if (!branch || !flavor || !ingredient || !qty) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const request = await IngredientRequest.create({
      branch,
      flavor,
      ingredient,
      qty,
    });

    res.status(201).json({
      message: "Ingredient request created successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all ingredient requests
export const getRequests = async (req, res) => {
  try {
    const requests = await IngredientRequest.find().populate("branch");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Approve ingredient request
export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await IngredientRequest.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json({ message: "Request approved", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject ingredient request
export const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await IngredientRequest.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json({ message: "Request rejected", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
