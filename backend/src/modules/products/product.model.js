const mongoose = require("mongoose");

/**
 * Each entry is `{ fileId, url }`; legacy documents may still hold plain URL strings.
 */
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
    /**
     * Preferred shape: `{ fileId: string, url: string }[]`.
     * `Mixed` keeps backward compatibility with legacy plain URL strings in existing documents.
     */
    images: { type: [mongoose.Schema.Types.Mixed], default: [] },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    totalSold: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

ProductSchema.index({ createdAt: -1 });

function normalizeProductImagesArray(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((entry) => {
      if (typeof entry === "string") {
        const u = entry.trim();
        return u ? { fileId: "", url: u } : null;
      }
      if (entry && typeof entry === "object" && typeof entry.url === "string") {
        const u = entry.url.trim();
        if (!u) return null;
        return { fileId: String(entry.fileId || ""), url: u };
      }
      return null;
    })
    .filter(Boolean);
}

function shapeImagesForApi(doc) {
  if (!doc) return doc;
  return { ...doc, images: normalizeProductImagesArray(doc.images) };
}

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product, normalizeProductImagesArray, shapeImagesForApi };
