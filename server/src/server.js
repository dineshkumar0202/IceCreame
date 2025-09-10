import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, MONGO_URI } from "./config.js";

// routes
import authRoutes from "./routes/auth.js";
import branchRoutes from "./routes/branches.js";
import salesRoutes from "./routes/sales.js";
import requestRoutes from "./routes/requests.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/requests", requestRoutes);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
