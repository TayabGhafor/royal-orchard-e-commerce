const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, trim: true, unique: true, index: true },
    tagline: { type: String, trim: true },
    description: { type: String, trim: true },
    variety: {
      type: String,
      enum: ["Sindhri", "Chaunsa", "Anwar Ratol", "Langra", "Mixed", "Other"],
      required: true,
      index: true,
    },
    collection: {
      type: String,
      enum: ["Premium Reserve", "Seasonal Specials", "Bulk Harvest"],
      required: true,
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    weights: { type: [String], default: ["3kg", "5kg", "8kg"], enum: ["3kg", "5kg", "8kg"] },
    stock: { type: Number, default: 0, min: 0, index: true },
    images: { type: [String], default: [] },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    totalSold: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

ProductSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };

