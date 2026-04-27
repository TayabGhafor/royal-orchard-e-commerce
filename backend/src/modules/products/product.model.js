const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    tagline: { type: String, trim: true },
    description: { type: String, trim: true },
    variety: {
      type: String,
      enum: ["Sindhri", "Chaunsa", "Anwar Ratol", "Langra"],
      required: true,
      index: true,
    },
    collection: {
      type: String,
      enum: ["Premium", "Seasonal", "Organic"],
      required: true,
      index: true,
    },
    pricePerKg: { type: Number, required: true, min: 0 },
    weights: { type: [Number], default: [3, 5, 8] },
    stock: { type: Number, default: 0, min: 0, index: true },
    images: { type: [String], default: [] },
    totalSold: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

ProductSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };

