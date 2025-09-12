import express from "express";
import { createSale, getAllSales } from "../controllers/salesController.js";

const router = express.Router();

router.get("/", getAllSales);
router.post("/", createSale);

export default router;
