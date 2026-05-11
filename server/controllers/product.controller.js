// ============================================================
// controllers/product.controller.js — CONTROLLER
// ============================================================
// The CONTROLLER contains the BUSINESS LOGIC.
// It receives the request (from the route), talks to the Model
// (database), and sends back a response.
//
// Data flow:
//   Request → Route → Controller → Model → DB
//                  ←           ←        ←
//
// req  = the incoming HTTP request  (headers, body, params)
// res  = the outgoing HTTP response (status, JSON)
// next = pass error to error-handler middleware
// ============================================================

const Product = require("../models/product.model.js");

// ── GET /api/products ───────────────────────────────────────
// Fetch all products from MongoDB
const getAllProducts = async (req, res) => {
  try {
    // Product.find({}) → queries the "products" collection
    // Returns an array of all documents
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/products/:id ───────────────────────────────────
// Fetch a single product by its MongoDB _id
const getProductById = async (req, res) => {
  try {
    // req.params.id → the :id segment from the URL
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── POST /api/products ──────────────────────────────────────
// Create a new product
// req.body contains the JSON sent from the frontend
const createProduct = async (req, res) => {
  try {
    // Destructure fields from req.body
    const { name, brand, price, ram, storage, camera, description, inStock } =
      req.body;

    // Create a new Mongoose document instance
    const newProduct = new Product({
      name,
      brand,
      price,
      ram,
      storage,
      camera,
      description,
      inStock,
    });

    // .save() writes the document to MongoDB
    const savedProduct = await newProduct.save();

    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    // Mongoose validation errors (e.g. missing required field)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── PUT /api/products/:id ───────────────────────────────────
// Update an existing product
const updateProduct = async (req, res) => {
  try {
    // findByIdAndUpdate → finds doc by _id, applies $set patch
    // { new: true }     → return the UPDATED document, not old
    // { runValidators } → run schema validators on update too
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/products/:id ────────────────────────────────
// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};