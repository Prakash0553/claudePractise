// ============================================================
// models/product.model.js — MODEL (MongoDB Schema)
// ============================================================
// The MODEL defines the SHAPE of data stored in MongoDB.
// Think of it as a blueprint / table definition.
//
// mongoose.Schema()  → describes the fields and their types
// mongoose.model()   → compiles the schema into a Model class
//                      that can interact with the DB collection
//
// MongoDB collection name will be "products" (auto-pluralised)
// ============================================================

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    ram: {
      type: String, // e.g. "8GB"
      required: [true, "RAM is required"],
    },
    storage: {
      type: String, // e.g. "128GB"
      required: [true, "Storage is required"],
    },
    camera: {
      type: String, // e.g. "108MP"
    },
    description: {
      type: String,
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// "Product" → collection name in MongoDB will be "products"
module.exports = mongoose.model("Product", productSchema);