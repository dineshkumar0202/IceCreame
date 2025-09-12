import Branch from "../models/Branch.js";

export const getAllBranches = async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
};


// Create new branch
export const createBranch = async (req, res) => {
  try {
    const { name, city } = req.body;

    if (!name || !city) {
      return res.status(400).json({ message: "Name and city are required" });
    }

    const newBranch = new Branch({ name, city });
    await newBranch.save();

    res.status(201).json({ message: "Branch created successfully", branch: newBranch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteBranch = async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ message: "Branch deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update branch by ID
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city } = req.body;

    if (!name || !city) {
      return res.status(400).json({ message: "Name and city are required" });
    }

    const branch = await Branch.findByIdAndUpdate(
      id,
      { name, city },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json({ message: "Branch updated successfully", branch });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
