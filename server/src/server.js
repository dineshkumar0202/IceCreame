import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, MONGO_URI } from "./config.js";
import branchRoutes from "./routes/branches.js";
import saleRoutes from "./routes/sales.js";
import ingredientRoutes from "./routes/ingredients.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// 🔑 Mount the route
app.use("/api/branches", branchRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("🍦 Ice Cream Running!");
});


// DB connect + start
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));
