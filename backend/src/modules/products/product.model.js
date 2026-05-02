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
    /** @deprecated Use `weightPrices` — kept for one-off migration scripts only. */
    price: { type: Number, min: 0 },
    weightPrices: { type: mongoose.Schema.Types.Mixed, default: {} },
    weights: { type: [String], default: ["3kg", "5kg", "8kg"], enum: ["3kg", "5kg", "8kg"] },
    /** @deprecated Replaced by `availabilityStatus` — may exist on old documents. */
    stock: { type: Number, min: 0 },
    availabilityStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock"],
      default: "In Stock",
      index: true,
    },
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

