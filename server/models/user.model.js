// ============================================================
// models/user.model.js — USER MODEL
// ============================================================
// Stores registered users.
// Password is stored as a bcrypt hash — never plain text.
// ============================================================

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true }
);

// ── Pre-save hook ────────────────────────────────────────────
// Runs automatically before every .save()
// Hashes the password only if it was modified (or is new)
// ✅ Modern Mongoose — no next parameter needed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance method ──────────────────────────────────────────
// Called on a user document to compare a plain password
// with the stored hash during login
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);