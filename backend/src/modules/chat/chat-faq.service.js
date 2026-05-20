const { searchKnowledge } = require("../chatbot/chatbot-knowledge-search");

const FAQ_TOPICS = [
  {
    id: "shipping",
    keys: ["shipping", "delivery", "dispatch", "how long", "ship"],
    answer:
      "We ship temperature-controlled crates across Pakistan. Orders before cutoff often dispatch same-day; tracking updates once your crate leaves our facility. Typical delivery is 2–4 business days.",
  },
  {
    id: "returns",
    keys: ["return", "refund", "exchange", "damaged"],
    answer:
      "Returns are accepted for damaged or wrong items within 48 hours of delivery. Visit /orders to request a return, or contact support via WhatsApp.",
  },
  {
    id: "payment",
    keys: ["payment", "pay", "cod", "easypaisa", "jazzcash", "card", "stripe"],
    answer:
      "We accept Cash on Delivery, Easypaisa, JazzCash, and Card (Stripe) at checkout. Choose your method on the checkout page.",
  },
  {
    id: "delivery",
    keys: ["delivery", "courier", "track", "when will"],
    answer:
      "Signed-in customers track orders at /orders. You'll see status from Placed through Delivered with expected delivery dates.",
  },
  {
    id: "organic",
    keys: ["organic", "certified", "pesticide", "natural"],
    answer:
      "Royal Orchard follows regenerative practices with natural pest management. Certification details appear on product pages where applicable.",
  },
  {
    id: "policy",
    keys: ["policy", "terms", "privacy", "warranty"],
    answer:
      "Store policies are at /terms, /privacy, and /refund-policy. Ask me about shipping, returns, or payments for quick answers.",
  },
];

async function answerFaq(question) {
  const q = String(question || "").trim();
  const lower = q.toLowerCase();

  for (const topic of FAQ_TOPICS) {
    if (topic.keys.some((k) => lower.includes(k))) {
      return { topic: topic.id, answer: topic.answer, source: "builtin" };
    }
  }

  const kb = await searchKnowledge(q);
  if (kb) return { topic: "knowledge", answer: kb, source: "mongodb" };

  return {
    topic: null,
    answer:
      "I can help with shipping, returns, payments, delivery, and organic certification. Try asking “How long is shipping?” or “What is your return policy?”",
    source: "fallback",
  };
}

function listFaqTopics() {
  return FAQ_TOPICS.map((t) => ({ id: t.id, sample: t.keys[0] }));
}

module.exports = { answerFaq, listFaqTopics, FAQ_TOPICS };
