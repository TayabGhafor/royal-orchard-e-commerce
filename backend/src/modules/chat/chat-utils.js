function formatPk(num) {
  return `Rs. ${Math.round(Number(num) || 0).toLocaleString("en-PK")}`;
}

function minPriceForProduct(p) {
  const wp = p.weightPrices && typeof p.weightPrices === "object" ? p.weightPrices : {};
  const nums = Object.values(wp)
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length) return Math.min(...nums);
  const legacy = Number(p.price);
  return Number.isFinite(legacy) && legacy > 0 ? legacy : 0;
}

function maxPriceForProduct(p) {
  const wp = p.weightPrices && typeof p.weightPrices === "object" ? p.weightPrices : {};
  const nums = Object.values(wp)
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length) return Math.max(...nums);
  const legacy = Number(p.price);
  return Number.isFinite(legacy) && legacy > 0 ? legacy : 0;
}

function shapeProductForChat(p) {
  return {
    id: String(p._id || p.id),
    slug: p.slug,
    name: p.name,
    variety: p.variety,
    collection: p.collection,
    tagline: p.tagline || "",
    minPrice: minPriceForProduct(p),
    rating: Number(p.rating) || 0,
    availabilityStatus: p.availabilityStatus,
    weights: p.weights || [],
  };
}

function trendingScore(p) {
  const views = Number(p.viewsCount || 0);
  const carts = Number(p.cartCount || 0);
  const sold = Number(p.totalSold || 0);
  return views * 0.3 + sold * 0.5 + carts * 0.2;
}

const VARIETIES = ["Sindhri", "Chaunsa", "Anwar Ratol", "Langra", "Mixed", "Other"];
const COLLECTIONS = ["Premium Reserve", "Seasonal Specials", "Bulk Harvest"];
const WEIGHTS = ["3kg", "5kg", "8kg"];

const COUPONS = {
  SUMMER10: { label: "SUMMER10", percent: 10, message: "10% off your harvest order" },
  ORCHARD15: { label: "ORCHARD15", percent: 15, message: "15% off for Royal Orchard members" },
  HARVEST5: { label: "HARVEST5", percent: 5, message: "5% seasonal harvest discount" },
};

const OUT_OF_SCOPE_REPLY =
  "Sorry, I can help with Royal Orchard products, orders, deliveries, and shopping assistance. Try asking about mangoes, prices, shipping, or your cart.";

module.exports = {
  formatPk,
  minPriceForProduct,
  maxPriceForProduct,
  shapeProductForChat,
  trendingScore,
  VARIETIES,
  COLLECTIONS,
  WEIGHTS,
  COUPONS,
  OUT_OF_SCOPE_REPLY,
};
