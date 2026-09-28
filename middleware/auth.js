const jwt = require('jsonwebtoken');
const db = require('../db');
const JWT_SECRET = process.env.JWT_SECRET || 'shopnest_secret_key_2026';

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided. Please login.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    
    try {
      const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User session expired or user not found. Please log in again.' });
      }
      req.user = user;
      next();
    } catch (e) {
      req.user = decoded;
      next();
    }
  });
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

module.exports = { authenticate, requireAdmin, JWT_SECRET };
