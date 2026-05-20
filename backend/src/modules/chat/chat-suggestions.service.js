const { Product } = require("../products/product.model");
const { VARIETIES } = require("./chat-utils");

async function getSuggestions(q, { limit = 8 } = {}) {
  const query = String(q || "").trim().toLowerCase();
  if (!query) return { suggestions: [] };

  const products = await Product.find({ isActive: true }).select("name variety tagline slug").lean();
  const out = [];
  const seen = new Set();

  const add = (text, kind, meta = {}) => {
    const key = `${kind}:${text.toLowerCase()}`;
    if (seen.has(key) || text.length < 2) return;
    seen.add(key);
    out.push({ text, kind, ...meta });
  };

  for (const v of VARIETIES) {
    if (v.toLowerCase().startsWith(query) || query.startsWith(v.toLowerCase().slice(0, 3))) {
      add(v, "variety");
    }
  }

  const sweetHints = ["Sweet Chaunsa", "Sweet Sindhri", "Honey Sindhri"];
  for (const h of sweetHints) {
    if (h.toLowerCase().includes(query) || query.startsWith("swe")) add(h, "phrase");
  }

  for (const p of products) {
    const name = p.name || "";
    const variety = p.variety || "";
    const nl = name.toLowerCase();
    const vl = variety.toLowerCase();
    if (nl.startsWith(query) || nl.includes(query) || vl.startsWith(query)) {
      add(name, "product", { slug: p.slug, productId: String(p._id) });
    }
    if (query.length >= 3 && (p.tagline || "").toLowerCase().includes(query)) {
      add(name, "product", { slug: p.slug, productId: String(p._id) });
    }
  }

  const phrases = [
    "show mangoes under 3000",
    "show sweet mangoes",
    "show premium mangoes",
    "show cheapest mangoes",
    "show organic products",
  ];
  for (const ph of phrases) {
    if (ph.includes(query)) add(ph, "search");
  }

  return { suggestions: out.slice(0, limit) };
}

module.exports = { getSuggestions };
