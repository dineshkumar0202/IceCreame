const jwt = require("jsonwebtoken");


// normal auth check
function authMiddleware(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const secret = process.env.JWT_SECRET || "fallback-secret";
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // user info from token
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
}

// check admin role
function adminMiddleware(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };
