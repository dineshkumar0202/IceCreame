const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const ingredientController = require("../controllers/ingredientController");
const router = express.Router();

// ✅ Create ingredient request (Users only)
router.post("/", authMiddleware, ingredientController.request);

// ✅ Get all ingredient requests (Admin + User - filtered by branch for users)
router.get("/", authMiddleware, ingredientController.list);

// ✅ Update ingredient request (Users can update their own, Admins can update any)
router.put("/:id", authMiddleware, ingredientController.update);

// ✅ Update ingredient request status (Admin only)
router.patch("/:id", authMiddleware, adminMiddleware, ingredientController.updateStatus);

// ✅ Delete ingredient request (Users can delete their own, Admins can delete any)
router.delete("/:id", authMiddleware, ingredientController.delete);

module.exports = router;
