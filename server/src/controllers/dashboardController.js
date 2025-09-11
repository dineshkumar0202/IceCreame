import Sale from "../models/Sale.js";
import Branch from "../models/Branch.js";

// 📊 Dashboard Summary (total outlets, total sales, top flavor overall)
export const getDashboardSummary = async (req, res) => {
  try {
    const totalBranches = await Branch.countDocuments();
    const totalSales = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$unitsSold" } } }
    ]);

    const topFlavor = await Sale.aggregate([
      { $group: { _id: "$flavor", total: { $sum: "$unitsSold" } } },
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]);

    return res.json({
      totalBranches,
      totalSales: totalSales[0]?.total || 0,
      topFlavor: topFlavor[0]?._id || null
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 📊 Top flavor per city (already written earlier)
export const getTopFlavorPerCity = async (req, res) => {
  try {
    const results = await Sale.aggregate([
      {
        $lookup: {
          from: "branches",
          localField: "branch",
          foreignField: "_id",
          as: "branchData"
        }
      },
      { $unwind: "$branchData" },
      {
        $group: {
          _id: { city: "$branchData.city", flavor: "$flavor" },
          total: { $sum: "$unitsSold" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    if (!results.length) {
      return res.json({ message: "No sales data found" });
    }

    const topFlavors = {};
    results.forEach(r => {
      const city = r._id.city;
      if (!topFlavors[city]) {
        topFlavors[city] = { flavor: r._id.flavor, unitsSold: r.total };
      }
    });

    return res.json(Object.keys(topFlavors).map(city => ({
      city,
      topFlavor: topFlavors[city].flavor,
      unitsSold: topFlavors[city].unitsSold
    })));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
