const { Product } = require("../products/product.model");
const { searchKnowledge } = require("../chatbot/chatbot-knowledge-search");
const { searchProducts, formatSearchReply } = require("./chat-search.service");
const { answerFaq, FAQ_TOPICS } = require("./chat-faq.service");
const { parseCartAction, isCartActionQuery } = require("./chat-cart.service");
const { getOrderStatusForUser, isOrderTrackingQuery } = require("./chat-order.service");
const { getRecommendations } = require("./chat-recommendations.service");
const { minPriceForProduct, formatPk, OUT_OF_SCOPE_REPLY } = require("./chat-utils");

const FALLBACK =
  "Sorry, I couldn't find that information. Please contact support or try another question.";

function summarizeProducts(products) {
  if (!products.length) return "No active products are listed right now. Please check back soon.";
  const lines = products.slice(0, 10).map((p) => {
    const min = minPriceForProduct(p);
    const weights = Array.isArray(p.weights) && p.weights.length ? p.weights.join(", ") : "3kg–8kg";
    const stockNote = p.availabilityStatus === "Out of Stock" ? "Out of stock" : "In stock";
    return `• ${p.name} (${p.variety}) — from ${formatPk(min)} · weights: ${weights} · ${stockNote}`;
  });
  return `Here's what we have live in the shop:\n${lines.join("\n")}\nBrowse full details at /shop.`;
}

async function tryOpenAI(env, message, contextBlock) {
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
              "You are the concise customer assistant for Royal Orchard, a premium Pakistani mango e-commerce brand. Answer in under 120 words. Only discuss mangoes, orders, shipping, returns, and shopping. If unsure, suggest WhatsApp or email support." +
              (contextBlock ? `\n\nContext:\n${contextBlock}` : ""),
          },
          { role: "user", content: q },
        ],
        max_tokens: 280,
        temperature: 0.5,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

function isSearchQuery(q) {
  return /\b(show|find|search|list|under|below|cheapest|sweet|premium|organic|rating|products?|mangoes?)\b/i.test(
    String(q || ""),
  );
}

function isOutOfScope(q) {
  const lower = String(q || "").toLowerCase();
  const store =
    /\b(mango|orchard|cart|order|ship|delivery|return|payment|price|chaunsa|sindhri|langra|ratol|shop|product|organic|coupon|harvest|crate|kg|pkr|rs)\b/i.test(
      lower,
    );
  const offTopic = /\b(weather|politics|football|bitcoin|homework|recipe unrelated)\b/i.test(lower);
  return offTopic && !store;
}

/**
 * @param {string} message
 * @param {object} env
 * @param {{ userId?: string, guestSessionId?: string }} ctx
 */
async function buildOrchestratedReply(message, env, ctx = {}) {
  const q = String(message || "").trim();
  if (!q) return { reply: FALLBACK };

  const lower = q.toLowerCase();

  if (/^(hi|hello|hey|good\s+(morning|afternoon|evening))\b/i.test(q)) {
    return {
      reply:
        "Hello — I'm your Royal Orchard assistant. Ask about mangoes, search the catalog, track orders, or manage your cart.",
      suggestions: ["show sweet mangoes", "track my order", "add 5kg Chaunsa"],
    };
  }

  if (/\b(thank|thanks)\b/i.test(q)) {
    return { reply: "You're welcome — enjoy the harvest!" };
  }

  if (isOutOfScope(q)) {
    return {
      reply: OUT_OF_SCOPE_REPLY,
      suggestions: FAQ_TOPICS.slice(0, 3).map((t) => t.keys[0]),
    };
  }

  const faq = await answerFaq(q);
  if (faq.source === "builtin") {
    return { reply: faq.answer, topic: faq.topic };
  }

  if (isOrderTrackingQuery(q)) {
    const status = await getOrderStatusForUser(ctx.userId, {});
    if (status.error) return { reply: status.error };
    return {
      reply: status.reply,
      order: {
        orderId: status.orderId,
        orderStatus: status.orderStatus,
        expectedDelivery: status.expectedDelivery,
        timeline: status.timeline,
      },
    };
  }

  const cartResult = await parseCartAction(q);
  if (cartResult && isCartActionQuery(q)) {
    return { reply: cartResult.reply, cartAction: cartResult };
  }

  if (isSearchQuery(q)) {
    const result = await searchProducts(q);
    return {
      reply: formatSearchReply(result),
      products: result.products,
      searchMeta: { total: result.total, parsed: result.parsed },
    };
  }

  if (/\b(recommend|suggest|which mango|sweetest|best mango)\b/i.test(q)) {
    const rec = await getRecommendations(ctx, "forYou", { limit: 5 });
    if (/\bsweetest\b/i.test(q)) {
      const sweet = await searchProducts("show sweet mangoes", { limit: 5 });
      if (sweet.products.length) {
        return {
          reply: `For peak sweetness, try:\n${sweet.products.map((p) => `• ${p.name} (${p.variety})`).join("\n")}`,
          products: sweet.products,
        };
      }
    }
    if (rec.products.length) {
      return {
        reply: `Recommended for you:\n${rec.products.map((p) => `• ${p.name} — from Rs. ${p.minPrice.toLocaleString("en-PK")}`).join("\n")}`,
        products: rec.products,
      };
    }
  }

  if (/\b(on sale|deals?|discount|offer|promo|seasonal)\b/i.test(q)) {
    const products = await Product.find({ isActive: true, collection: "Seasonal Specials" }).limit(6).lean();
    if (products.length) return { reply: summarizeProducts(products) };
    const deals = await searchProducts("show seasonal specials", { limit: 6 });
    return { reply: formatSearchReply(deals), products: deals.products };
  }

  if (/\b(cheapest|lowest price)\b/i.test(q)) {
    const cheap = await searchProducts("show cheapest mangoes", { limit: 6 });
    return { reply: formatSearchReply(cheap), products: cheap.products };
  }

  let products = await Product.find({ isActive: true }).sort({ name: 1 }).limit(40).lean();
  const productIntent =
    /\b(price|prices|cost|how much|stock|available|buy|mango|shop|variety|sindhri|chaunsa)\b/i.test(q);

  const varietyMatch = ["Sindhri", "Chaunsa", "Anwar Ratol", "Langra", "Mixed", "Other"].find((v) =>
    lower.includes(v.toLowerCase()),
  );
  let productsForReply = products;
  if (varietyMatch) {
    const filtered = products.filter((p) => p.variety === varietyMatch);
    if (filtered.length) productsForReply = filtered;
  }

  if (productIntent && productsForReply.length) {
    return { reply: summarizeProducts(productsForReply) };
  }

  if (faq.source === "mongodb") {
    return { reply: faq.answer, topic: faq.topic };
  }

  const kb = await searchKnowledge(q);
  if (kb) return { reply: kb };

  const ai = await tryOpenAI(env, q);
  if (ai) return { reply: ai };

  return { reply: FALLBACK };
}

module.exports = { buildOrchestratedReply, FALLBACK };
