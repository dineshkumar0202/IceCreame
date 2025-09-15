const r = require("express").Router();
const ctrl = require("../controllers/dashboardController");
const { authMiddleware } = require("../middleware/auth");
r.get("/totals", authMiddleware, ctrl.totals);
r.get("/top-flavor", authMiddleware, ctrl.topFlavorByCity);
r.get("/top-flavors", authMiddleware, ctrl.topFlavors);
module.exports = r;
