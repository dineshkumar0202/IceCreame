import express from "express";
import {
  getAllSales,
  createSale,
  deleteSale,
} from "../controllers/salesController.js";

const router = express.Router();

router.get("/", getAllSales);
router.post("/", createSale);
router.delete("/:id", deleteSale);

export default router;
