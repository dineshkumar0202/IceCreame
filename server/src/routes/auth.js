// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const { username, password, branch } = req.body;

    // Validate input
    if (!username || username.length < 5) {
      return res.status(400).json({ message: "Username must be at least 5 characters long" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (default role is 'branch')
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'branch',
      branch: branch || 'New Branch'
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, branch: newUser.branch, username: newUser.username },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );

    res.json({ 
      message: "Registration successful", 
      token, 
      role: newUser.role, 
      branch: newUser.branch,
      username: newUser.username
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Use bcrypt to compare hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, branch: user.branch, username: user.username },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );

    res.json({ 
      message: "Login successful", 
      token, 
      role: user.role, 
      branch: user.branch,
      username: user.username
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
 
// --- Admin: Update own credentials (username/password) ---
// PUT /api/auth/admin/credentials
// Body: { currentPassword, newUsername?, newPassword? }
router.put("/admin/credentials", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required" });
    }

    if (!newUsername && !newPassword) {
      return res.status(400).json({ message: "Provide newUsername and/or newPassword" });
    }

    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(404).json({ message: "Admin user not found" });
    }

    const isCurrentOk = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isCurrentOk) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (newUsername) {
      if (typeof newUsername !== 'string' || newUsername.length <= 5) {
        return res.status(400).json({ message: "Username must be at least 6 characters long" });
      }
      const exists = await User.findOne({ username: newUsername, _id: { $ne: adminUser._id } });
      if (exists) {
        return res.status(400).json({ message: "Username already taken" });
      }
      adminUser.username = newUsername;
    }

    if (newPassword) {
      if (typeof newPassword !== 'string' || newPassword.length <= 5) {
        return res.status(400).json({ message: "Password must be at least 5 characters long" });
      }
      adminUser.password = await bcrypt.hash(newPassword, 5);
    }

    await adminUser.save();

    // Issue a fresh token reflecting any username change
    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role, branch: adminUser.branch, username: adminUser.username },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Credentials updated successfully",
      token,
      role: adminUser.role,
      branch: adminUser.branch,
      username: adminUser.username
    });
  } catch (err) {
    console.error("Update admin credentials error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
    