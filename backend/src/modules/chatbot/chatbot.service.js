const { Product } = require("../products/product.model");
const { ChatbotKnowledge } = require("./chatbot-knowledge.model");

const FALLBACK =
  "Sorry, I couldn't find that information. Please contact support or try another question.";

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const STATIC_FAQ = [
  {
    keys: ["shipping", "delivery", "dispatch", "ship"],
    reply:
      "We ship temperature-controlled boxes across Pakistan. Typical dispatch is same-day when you order before cutoff; tracking is emailed once your crate leaves our facility.",
  },
  {
    keys: ["fresh", "freshness", "cold", "chain"],
    reply:
      "Royal Orchard mangoes are harvested at dawn and flash-cooled to lock in sweetness. Read more on our Freshness page at /freshness.",
  },
  {
    keys: ["organic", "pesticide", "certified"],
    reply:
      "We follow regenerative orchard practices and prioritize natural pest management. Certification details appear on product pages where applicable.",
  },
  {
    keys: ["wholesale", "bulk", "corporate"],
    reply:
      "For wholesale and corporate gifting, visit /wholesale or email our team from the contact options in this widget.",
  },
  {
    keys: ["about", "story", "orchard", "heritage"],
    reply:
      "Royal Orchard blends heritage varieties with modern cold-chain logistics. Discover our story at /our-story.",
  },
];

function formatPk(num) {
  return `Rs. ${Math.round(Number(num) || 0).toLocaleString("en-PK")}`;
}

function summarizeProducts(products) {
  if (!products.length) return "No active products are listed right now. Please check back soon.";
  const lines = products.slice(0, 10).map((p) => {
    const weights = Array.isArray(p.weights) && p.weights.length ? p.weights.join(", ") : "3kg–8kg";
    const stockNote = p.stock > 0 ? `In stock (${p.stock} units)` : "Low / ask us";
    return `• ${p.name} (${p.variety}) — ${formatPk(p.price)} · weights: ${weights} · ${stockNote}`;
  });
  return `Here's what we have live in the shop:\n${lines.join("\n")}\nBrowse full details at /shop.`;
}

function summarizeDeals(products) {
  const deals = products.filter((p) => p.collection === "Seasonal Specials");
  if (!deals.length) {
    return "Seasonal specials rotate frequently — open the Shop and filter by collection “Seasonal Specials”, or ask about a variety by name.";
  }
  return (
    `Seasonal spotlight picks:\n${deals
      .slice(0, 6)
      .map((p) => `• ${p.name} — ${formatPk(p.price)} (${p.variety})`)
      .join("\n")}\nVisit /shop for live pricing and stock.`
  );
}

async function searchKnowledge(message) {
  const raw = String(message || "").trim();
  if (!raw) return null;

  const words = raw
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z0-9]/gi, ""))
    .filter((w) => w.length > 2)
    .slice(0, 10);

  if (words.length === 0) return null;

  const or = words.flatMap((w) => {
    const rx = new RegExp(escapeRegex(w), "i");
    return [{ title: rx }, { content: rx }];
  });

  const docs = await ChatbotKnowledge.find({ $or: or }).sort({ updatedAt: -1 }).limit(4).lean();

  if (!docs.length) return null;

  const best = docs[0];
  const snippet =
    best.content.length > 900 ? `${best.content.slice(0, 900).trim()}…` : best.content;
  return `${best.title}\n\n${snippet}`;
}

async function tryOpenAI(env, message) {
  const key = env.OPENAI_API_KEY;
  if (!key) return null;
  const q = String(message || "").trim();
  if (q.length < 3) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are the concise customer assistant for Royal Orchard, a premium Pakistani mango e-commerce brand. Answer in under 120 words. If unsure, suggest contacting support via WhatsApp or email from the site.",
          },
          { role: "user", content: q },
        ],
        max_tokens: 280,
        temperature: 0.5,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch {
    return null;
  }
}

/**
 * @param {string} message
 * @param {object} env from loadEnv
 */
async function buildReply(message, env) {
  const q = String(message || "").trim();
  if (!q) return FALLBACK;

  const lower = q.toLowerCase();

  if (/^(hi|hello|hey|good\s+(morning|afternoon|evening))\b/i.test(q)) {
    return "Hello — I'm here to help with mangoes, pricing, orders, and Royal Orchard. What would you like to know?";
  }

  if (/\b(thank|thanks)\b/i.test(q)) {
    return "You're welcome — enjoy the harvest!";
  }

  for (const row of STATIC_FAQ) {
    if (row.keys.some((k) => lower.includes(k))) return row.reply;
  }

  let products = await Product.find({ isActive: true }).sort({ name: 1 }).limit(40).lean();

  const productIntent =
    /\b(price|prices|cost|how much|stock|available|buy|purchase|mango|mangoes|catalog|shop|kg|pkr|rs\.?|variety|sindhri|chaunsa|langra|anwar|ratol|crate|box)\b/i.test(
      q,
    );

  const varietyMatch = ["Sindhri", "Chaunsa", "Anwar Ratol", "Langra", "Mixed", "Other"].find((v) =>
    lower.includes(v.toLowerCase()),
  );
  let productsForReply = products;
  if (varietyMatch) {
    const filtered = products.filter((p) => p.variety === varietyMatch);
    if (filtered.length) productsForReply = filtered;
  }

  if (productIntent && productsForReply.length) {
    return summarizeProducts(productsForReply);
  }

  if (/\b(deal|deals|discount|sale|offer|promo|seasonal)\b/i.test(q) && products.length) {
    return summarizeDeals(products);
  }

  if (/\b(order|orders|track|tracking|status|delivered|invoice)\b/i.test(q)) {
    return "Signed-in customers can track purchases under Account → Orders (/orders). Guest checkout emails include updates — reply there or use WhatsApp from our support button for urgent help.";
  }

  const kb = await searchKnowledge(q);
  if (kb) return kb;

  const ai = await tryOpenAI(env, q);
  if (ai) return ai;

  return FALLBACK;
}

module.exports = {
  buildReply,
  FALLBACK,
};
