const { Product } = require("../products/product.model");
const { COUPONS, formatPk } = require("./chat-utils");

const VARIETIES = ["sindhri", "chaunsa", "anwar ratol", "langra"];

function parseWeight(text) {
  const m = String(text).match(/(\d+)\s*kg/i);
  if (m) return `${m[1]}kg`;
  return "5kg";
}

function parseQuantity(text) {
  const m = String(text).match(/\b(\d+)\s*(?:x|crates?|boxes?|qty|quantity)?/i);
  if (m) return Math.max(1, Math.min(20, Number(m[1])));
  return 1;
}

async function findProductByNameHint(hint) {
  const lower = String(hint || "").toLowerCase().trim();
  const products = await Product.find({ isActive: true }).lean();

  for (const v of VARIETIES) {
    if (lower.includes(v)) {
      const match = products.find((p) => p.variety.toLowerCase() === v || p.name.toLowerCase().includes(v));
      if (match) return match;
    }
  }

  const byName = products
    .map((p) => ({ p, s: p.name.toLowerCase().includes(lower) ? 100 : 0 }))
    .filter((x) => x.s > 0 || lower.split(/\s+/).some((w) => p.name.toLowerCase().includes(w)));
  if (byName.length) return byName[0]?.p;

  return (
    products.find((p) => lower && p.name.toLowerCase().includes(lower)) ||
    products.find((p) => p.variety.toLowerCase().includes(lower.split(/\s+/)[0] || ""))
  );
}

/**
 * Parse cart assistant intents; returns structured action for the storefront to apply.
 */
async function parseCartAction(message) {
  const q = String(message || "").trim();
  const lower = q.toLowerCase();

  const couponMatch = lower.match(/\bapply\s+([A-Z0-9]{4,20})\b/i) || lower.match(/\b([A-Z]{4,}[0-9]{1,4})\b/);
  if (/\b(apply|coupon|promo|discount code)\b/i.test(lower) && couponMatch) {
    const code = (couponMatch[1] || couponMatch[0]).toUpperCase();
    const c = COUPONS[code];
    if (c) {
      return {
        action: "applyCoupon",
        couponCode: c.label,
        discountPercent: c.percent,
        reply: `Applied ${c.label}: ${c.message}. Your discount will show in the cart.`,
      };
    }
    return {
      action: "none",
      reply: `Coupon "${code}" isn't active. Try SUMMER10, ORCHARD15, or HARVEST5.`,
    };
  }

  if (/\b(cart summary|what'?s in my cart|show cart|my cart)\b/i.test(lower)) {
    return {
      action: "summary",
      reply: "Open your basket with the cart icon — I can add or remove items when you tell me the variety and weight.",
    };
  }

  if (/\b(remove|delete)\b/i.test(lower)) {
    const product = await findProductByNameHint(lower);
    if (!product) return { action: "none", reply: "Which product should I remove? Name the variety (e.g. Sindhri)." };
    const weight = parseWeight(lower);
    return {
      action: "remove",
      productId: String(product._id),
      productName: product.name,
      weight,
      reply: `Removed ${product.name} (${weight}) from your cart.`,
    };
  }

  if (/\b(change|update|set)\b.*\b(quantity|qty)\b/i.test(lower)) {
    const product = await findProductByNameHint(lower);
    const qty = parseQuantity(lower);
    if (!product) return { action: "none", reply: "Tell me which product to update, e.g. “Change Chaunsa quantity to 2”." };
    const weight = parseWeight(lower);
    return {
      action: "updateQuantity",
      productId: String(product._id),
      productName: product.name,
      weight,
      quantity: qty,
      reply: `Updated ${product.name} (${weight}) to quantity ${qty}.`,
    };
  }

  if (/\b(add|put)\b/i.test(lower) || /\b\d+\s*kg\b/i.test(lower)) {
    const product = await findProductByNameHint(lower);
    if (!product) {
      return { action: "none", reply: 'Say something like “Add 5kg Chaunsa” and I\'ll add it to your cart.' };
    }
    if (product.availabilityStatus === "Out of Stock") {
      return { action: "none", reply: `${product.name} is currently out of stock.` };
    }
    const weight = parseWeight(lower);
    const quantity = parseQuantity(lower);
    const wp = product.weightPrices?.[weight];
    const price = Number(wp) || Number(product.price) || 0;
    return {
      action: "add",
      productId: String(product._id),
      slug: product.slug,
      productName: product.name,
      weight,
      quantity,
      unitPrice: price,
      reply: `Added ${quantity}× ${product.name} (${weight}) — ${formatPk(price * quantity)}.`,
    };
  }

  return null;
}

function isCartActionQuery(q) {
  return /\b(add|remove|delete|apply|coupon|cart|quantity|change)\b/i.test(String(q || ""));
}

module.exports = { parseCartAction, isCartActionQuery, COUPONS };
