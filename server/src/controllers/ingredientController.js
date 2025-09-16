const IngredientRequest = require("../models/IngredientRequest");

// GET all requests
exports.getRequests = async (req, res) => {
  try {
    const query = req.user?.role === "branch" ? { branch: req.user.branch } : {};
    console.log("Fetching ingredient requests with query:", query);

    const requests = await IngredientRequest.find(query);
    console.log("Found", requests.length, "ingredient requests");

    res.json(requests);
  } catch (error) {
    console.error("Error fetching ingredient requests:", error);
    res.status(500).json({ error: "Failed to fetch ingredient requests" });
  }
};

// CREATE request
exports.request = async (req, res) => {
  try {
    const request = new IngredientRequest({
      branch: req.body.branch,
      city: req.body.city,
      flavor: req.body.flavor,
      ingredient: req.body.ingredient,
      qty: req.body.qty,
      requestedBy: req.user?.name || req.user?.email || req.user?._id,
      status: "pending",
      date: new Date(),
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    console.error("Error creating ingredient request:", error);
    res.status(500).json({ error: "Failed to create ingredient request" });
  }
};

// UPDATE status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await IngredientRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Error updating ingredient request:", error);
    res.status(500).json({ error: "Failed to update request" });
  }
};

// DELETE
exports.deleteRequest = async (req, res) => {
  try {
    await IngredientRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted" });
  } catch (error) {
    console.error("Error deleting ingredient request:", error);
    res.status(500).json({ error: "Failed to delete request" });
  }
};
