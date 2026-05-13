// ============================================================
// middleware/auth.middleware.js — JWT PROTECT MIDDLEWARE
// ============================================================
// This middleware runs BEFORE any protected route handler.
// It checks the Authorization header for a valid JWT token.
//
// How it works:
//   1. Client sends:  Authorization: Bearer <token>
//   2. Middleware extracts the token
//   3. jwt.verify() checks signature + expiry
//   4. Decoded payload (userId) is attached to req.user
//   5. next() passes control to the actual route handler
//
// If token is missing or invalid → 401 Unauthorized response
// ============================================================

const jwt  = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify token — throws if expired or invalid signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (without password) to the request object
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    next(); // ✅ token is valid, proceed to route handler
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

module.exports = { protect };