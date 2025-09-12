import express from "express";
import {
  getAllBranches,
  createBranch,
  deleteBranch,
  updateBranch,
} from "../controllers/branchController.js";

const router = express.Router();

router.get("/", getAllBranches);
router.post("/", createBranch);
router.put("/:id", updateBranch);   // <-- new
router.delete("/:id", deleteBranch);

export default router;
