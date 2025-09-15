const jwt = require('jsonwebtoken');
module.exports = function(roles = []) {
  return (req, res, next) => {
    const h = req.headers['authorization'];
    if (!h) return res.status(401).json({ message: 'No token' });
    const token = h.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      if (roles.length && !roles.includes(decoded.role)) return res.status(403).json({ message: 'Forbidden' });
      req.user = decoded; next();
    } catch (e) { return res.status(401).json({ message: 'Invalid token' }); }
  }
}
