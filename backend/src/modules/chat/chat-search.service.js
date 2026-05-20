const { Product } = require("../products/product.model");
const { minPriceForProduct, maxPriceForProduct, shapeProductForChat } = require("./chat-utils");

/**
 * Parse natural language into structured filters for Royal Orchard catalog.
 * @returns {{ mongoFilter: object, sort: object, intent: string, parsed: object }}
 */
function parseNaturalLanguageQuery(q) {
  const lower = String(q || "")
    .toLowerCase()
    .trim();
  const parsed = {
    maxPrice: null,
    minPrice: null,
    minRating: null,
    variety: null,
    collection: null,
    maxWeightKg: null,
    minWeightKg: null,
    inStockOnly: true,
    organic: false,
    sweet: false,
    premium: false,
    cheapest: false,
    sortByPriceAsc: false,
    sortByRatingDesc: false,
  };

  const underPrice = lower.match(/\b(?:under|below|less than|max|upto|up to)\s*(?:rs\.?|pkr)?\s*([\d,]+)/i);
  const overPrice = lower.match(/\b(?:over|above|more than|min|from)\s*(?:rs\.?|pkr)?\s*([\d,]+)/i);
  if (underPrice) parsed.maxPrice = Number(underPrice[1].replace(/,/g, ""));
  if (overPrice) parsed.minPrice = Number(overPrice[1].replace(/,/g, ""));

  if (/\b(high rating|top rated|best rated|rating\s*4|4\+?\s*star)\b/i.test(lower)) {
    parsed.minRating = 4.5;
    parsed.sortByRatingDesc = true;
  } else if (/\b(good rating|rated)\b/i.test(lower)) {
    parsed.minRating = 4;
  }

  if (/\b(cheapest|lowest price|most affordable|budget)\b/i.test(lower)) parsed.cheapest = true;
  if (/\b(sweet|sweeter|sweetest|honey)\b/i.test(lower)) parsed.sweet = true;
  if (/\b(premium|reserve|luxury|finest)\b/i.test(lower)) parsed.premium = true;
  if (/\b(organic|natural|pesticide|certified)\b/i.test(lower)) parsed.organic = true;
  if (/\b(in stock|available)\b/i.test(lower)) parsed.inStockOnly = true;
  if (/\b(out of stock|unavailable)\b/i.test(lower)) parsed.inStockOnly = false;

  const weightUnder = lower.match(/\bunder\s*(\d+)\s*kg\b/i);
  const weightMax = lower.match(/\b(?:max|maximum)\s*(\d+)\s*kg\b/i);
  if (weightUnder || weightMax) parsed.maxWeightKg = Number((weightUnder || weightMax)[1]);

  const weightAt = lower.match(/\b(\d+)\s*kg\b/);
  if (weightAt && !parsed.maxWeightKg) {
    const kg = Number(weightAt[1]);
    if (kg <= 8) {
      parsed.minWeightKg = kg;
      parsed.maxWeightKg = kg;
    }
  }

  const varieties = ["sindhri", "chaunsa", "anwar ratol", "langra", "mixed"];
  for (const v of varieties) {
    if (lower.includes(v)) {
      parsed.variety =
        v === "anwar ratol"
          ? "Anwar Ratol"
          : v.charAt(0).toUpperCase() + v.slice(1);
      break;
    }
  }

  if (/\bseasonal\b/i.test(lower)) parsed.collection = "Seasonal Specials";
  else if (/\bbulk\b/i.test(lower)) parsed.collection = "Bulk Harvest";
  else if (parsed.premium) parsed.collection = "Premium Reserve";

  if (parsed.cheapest) parsed.sortByPriceAsc = true;

  return parsed;
}

function weightKgFromLabel(w) {
  const m = String(w).match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

function productMatchesParsed(p, parsed) {
  const minP = minPriceForProduct(p);
  const maxP = maxPriceForProduct(p);
  if (parsed.maxPrice != null && Number.isFinite(parsed.maxPrice) && minP > parsed.maxPrice) return false;
  if (parsed.minPrice != null && Number.isFinite(parsed.minPrice) && maxP < parsed.minPrice) return false;
  if (parsed.minRating != null && (Number(p.rating) || 0) < parsed.minRating) return false;
  if (parsed.variety && p.variety !== parsed.variety) return false;
  if (parsed.collection && p.collection !== parsed.collection) return false;
  if (parsed.inStockOnly && p.availabilityStatus === "Out of Stock") return false;
  if (!parsed.inStockOnly && p.availabilityStatus !== "Out of Stock") return false;

  if (parsed.maxWeightKg != null || parsed.minWeightKg != null) {
    const weights = Array.isArray(p.weights) ? p.weights : [];
    const kgs = weights.map(weightKgFromLabel).filter((n) => n != null);
    if (!kgs.length) return false;
    if (parsed.maxWeightKg != null && !kgs.some((k) => k <= parsed.maxWeightKg)) return false;
    if (parsed.minWeightKg != null && parsed.minWeightKg === parsed.maxWeightKg) {
      const label = `${parsed.minWeightKg}kg`;
      if (!weights.includes(label)) return false;
    }
  }

  const blob = `${p.name} ${p.tagline} ${p.description} ${p.variety}`.toLowerCase();
  if (parsed.sweet && !/\b(sweet|honey|sugar|brix)\b/i.test(blob)) return false;
  if (parsed.organic && !/\b(organic|natural|regenerative|pesticide)\b/i.test(blob)) return false;

  return true;
}

async function searchProducts(query, { limit = 12 } = {}) {
  const parsed = parseNaturalLanguageQuery(query);
  const base = await Product.find({ isActive: true }).lean();

  let results = base.filter((p) => productMatchesParsed(p, parsed));

  if (parsed.sortByPriceAsc) {
    results.sort((a, b) => minPriceForProduct(a) - minPriceForProduct(b));
  } else if (parsed.sortByRatingDesc) {
    results.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  } else {
    results.sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    parsed,
    products: results.slice(0, limit).map(shapeProductForChat),
    total: results.length,
  };
}

function formatSearchReply(result) {
  if (!result.products.length) {
    return "I couldn't find products matching that search. Try /shop or ask for a variety like Chaunsa or Sindhri.";
  }
  const lines = result.products.map(
    (p) => `• ${p.name} (${p.variety}) — from Rs. ${p.minPrice.toLocaleString("en-PK")} · ${p.availabilityStatus}`,
  );
  return `Found ${result.total} match${result.total === 1 ? "" : "es"}:\n${lines.join("\n")}\nOpen /shop to browse.`;
}

module.exports = {
  parseNaturalLanguageQuery,
  searchProducts,
  formatSearchReply,
};
