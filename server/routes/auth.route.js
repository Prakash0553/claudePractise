// ============================================================
// routes/auth.route.js — AUTH ROUTES
// ============================================================
// POST /api/auth/signup  → register new user
// POST /api/auth/login   → login, returns JWT
// GET  /api/auth/me      → get logged-in user (protected)
// ============================================================

const express = require("express");
const router  = express.Router();
const { signup, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/login",  login);
router.get("/me",      protect, getMe); // protect runs before getMe

module.exports = router;