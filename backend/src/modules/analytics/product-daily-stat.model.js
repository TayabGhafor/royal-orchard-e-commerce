const mongoose = require("mongoose");

/** UTC midnight buckets for view/cart velocity (upcoming-trending). */
const ProductDailyStatSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    day: { type: Date, required: true, index: true },
    views: { type: Number, default: 0, min: 0 },
    cartAdds: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

ProductDailyStatSchema.index({ product: 1, day: 1 }, { unique: true });

const ProductDailyStat = mongoose.model("ProductDailyStat", ProductDailyStatSchema);

module.exports = { ProductDailyStat };
