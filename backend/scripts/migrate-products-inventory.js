/**
 * One-time migration: legacy `price` + `stock` -> `weightPrices` + `availabilityStatus`.
 * Run: node scripts/migrate-products-inventory.js
 * Requires MONGODB_URI in .env (or environment).
 */
require("dotenv").config();
const mongoose = require("mongoose");
const { Product } = require("../src/modules/products/product.model");

const WEIGHT_KEYS = ["3kg", "5kg", "8kg"];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }
  await mongoose.connect(uri);
  const cursor = Product.find({}).cursor();
  let n = 0;
  // eslint-disable-next-line no-restricted-syntax
  for await (const doc of cursor) {
    const weights = Array.isArray(doc.weights) && doc.weights.length ? doc.weights : ["3kg", "5kg", "8kg"];
    const base = Number(doc.price) || 0;
    const wp = doc.weightPrices && typeof doc.weightPrices === "object" ? { ...doc.weightPrices } : {};
    // eslint-disable-next-line no-restricted-syntax
    for (const w of weights) {
      if (!WEIGHT_KEYS.includes(w)) continue;
      const v = wp[w];
      if (!Number.isFinite(Number(v)) || Number(v) <= 0) {
        if (base > 0) wp[w] = base;
      }
    }
    if (!Object.keys(wp).some((k) => WEIGHT_KEYS.includes(k) && Number(wp[k]) > 0)) {
      // eslint-disable-next-line no-console
      console.warn(`[migrate] Skipping ${doc.slug || doc._id}: no valid weight prices and no legacy price`);
      // eslint-disable-next-line no-continue
      continue;
    }

    const hasStatus = doc.availabilityStatus === "In Stock" || doc.availabilityStatus === "Out of Stock";
    const availabilityStatus = hasStatus
      ? doc.availabilityStatus
      : Number(doc.stock) > 0
        ? "In Stock"
        : "Out of Stock";

    // eslint-disable-next-line no-await-in-loop
    await Product.updateOne(
      { _id: doc._id },
      {
        $set: {
          weightPrices: wp,
          availabilityStatus,
        },
        $unset: { price: "", stock: "" },
      },
    );
    n += 1;
  }
  console.log(`Migrated ${n} products.`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
