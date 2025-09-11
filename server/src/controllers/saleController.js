import Sales from "../models/Sales.js";

export const getAllSales = async (req, res) => {
  const sales = await Sales.find().populate("branch");
  res.json(sales);
};

export const createSale = async (req, res) => {
  try {
    const { branch, flavor, unitsSold } = req.body;
    if (!branch || !flavor || !unitsSold) {
      return res.status(400).json({ message: "All fields required" });
    }
    const sale = await Sales.create({ branch, flavor, unitsSold });
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteSale = async (req, res) => {
  try {
    await Sales.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
