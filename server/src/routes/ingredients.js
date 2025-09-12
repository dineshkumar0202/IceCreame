import express from "express";
import {
  createRequest,
  getRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/ingredientController.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.patch("/:id/approve", approveRequest);
router.patch("/:id/reject", rejectRequest);

export default router;
