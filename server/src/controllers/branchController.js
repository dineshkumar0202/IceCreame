import Branch from "../models/Branch.js";

export const getAllBranches = async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
};

export const createBranch = async (req, res) => {
  try {
    const { name, city } = req.body;
    if (!name || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const branch = await Branch.create({ name, city });
    res.status(201).json(branch);
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
