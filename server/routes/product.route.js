// ============================================================
// routes/product.route.js — ROUTES
// ============================================================
// The ROUTE maps HTTP method + URL path → Controller function.
// It does NOT contain logic — it just "directs traffic".
//
// Express Router lets us group related routes into a module.
// The router is then mounted in server.js at /api/products,
// so paths here are RELATIVE to that base path.
//
// Full URL breakdown:
//   GET    /api/products        → getAllProducts
//   GET    /api/products/:id    → getProductById
//   POST   /api/products        → createProduct
//   PUT    /api/products/:id    → updateProduct
//   DELETE /api/products/:id    → deleteProduct
//
// :id is a URL parameter (dynamic segment), e.g. /api/products/64abc...
// ============================================================

const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// Base path: /api/products
router.get("/", getAllProducts);
router.post("/", createProduct);

// Base path: /api/products/:id
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;