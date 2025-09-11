import express from "express";
import { getDashboardSummary, getTopFlavorPerCity } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", getDashboardSummary);   // Homepage summary
router.get("/top-flavors", getTopFlavorPerCity); // Top flavor per city

export default router;
