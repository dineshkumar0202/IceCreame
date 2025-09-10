import express from "express";
import Sales from "../models/Sales.js";
import Branch from "../models/Branch.js";
import Flavor from "../models/Flavor.js";

const router = express.Router();

// Sales per branch
router.get("/branch/:branchId", async (req, res) => {
  try {
    const sales = await Sales.find({ branch: req.params.branchId })
      .populate("flavor")
      .populate("branch");
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Top-selling flavor per city
router.get("/top/:cityId", async (req, res) => {
  try {
    const sales = await Sales.aggregate([
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branch",
        },
      },
      { $unwind: "$branch" },
      { $match: { "branch.city": req.params.cityId } },
      { $group: { _id: "$flavor", total: { $sum: "$unitsSold" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
