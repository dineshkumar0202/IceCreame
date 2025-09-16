const jwt = require("jsonwebtoken");

// normal auth check
function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: "No authorization header provided",
      message: "Authentication required. Please log in."
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      error: "Invalid authorization header format",
      message: "Invalid authentication format. Please log in again."
    });
  }

  const token = authHeader.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ 
      error: "No token provided",
      message: "Authentication token required. Please log in."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    req.user = decoded; // user info from token
    console.log(`Authenticated user: ${decoded.username || decoded.id} (${decoded.role})`);
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Token expired",
        message: "Your session has expired. Please log in again."
      });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        error: "Invalid token",
        message: "Invalid authentication token. Please log in again."
      });
    } else {
      return res.status(401).json({ 
        error: "Token verification failed",
        message: "Authentication failed. Please log in again."
      });
    }
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
