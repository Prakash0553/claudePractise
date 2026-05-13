// ============================================================
// controllers/auth.controller.js — AUTH CONTROLLER
// ============================================================
// signup → create user → return JWT
// login  → verify credentials → return JWT
//
// JWT payload contains: { id: user._id }
// The token is sent back to the client and stored in
// localStorage. Every subsequent request attaches it in
// the Authorization header.
// ============================================================

const jwt  = require("jsonwebtoken");
const User = require("../models/user.model");

// Helper: generate a signed JWT token for a user id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ── POST /api/auth/signup ────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    // Create user — password is hashed by the pre-save hook in user.model.js
    const user = await User.create({ name, email, password });

    // Respond with user info + token
    res.status(201).json({
      success: true,
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Compare plain password with hashed password using bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.status(200).json({
      success: true,
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────
// Returns the currently logged-in user (token required)
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json({ success: true, data: req.user });
};

module.exports = { signup, login, getMe };