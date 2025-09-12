import Sale from "../models/Sale.js";

// ➕ Add a new sale
export const createSale = async (req, res) => {
  try {
    const { branch, flavor, unitsSold } = req.body;

    if (!branch || !flavor || !unitsSold) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sale = await Sale.create({ branch, flavor, unitsSold });
    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get all sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("branch");
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
