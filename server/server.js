// ============================================================
// server.js — ENTRY POINT
// ============================================================
// This is where Express is configured and the app starts.
// It connects to MongoDB, loads middleware, and mounts routes.
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load .env variables into process.env

const productRoutes = require("./routes/product.route.js");
const authRoutes    = require("./routes/auth.route");


const app = express();

// ── Middleware ──────────────────────────────────────────────
// cors()      → allows the React frontend (port 3000) to call
//               this API (port 5000) without browser blocking
// express.json() → parses incoming JSON request bodies so we
//               can read req.body in controllers
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
// All requests to /api/products are forwarded to productRoutes
app.use("/api/auth",     authRoutes);     // login, signup
app.use("/api/products", productRoutes);

// ── DB + Server Start ───────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));