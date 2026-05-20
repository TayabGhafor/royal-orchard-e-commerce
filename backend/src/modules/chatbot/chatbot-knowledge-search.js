const { ChatbotKnowledge } = require("./chatbot-knowledge.model");

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

  const docs = await ChatbotKnowledge.find({ $or: or, enabled: { $ne: false } })
    .sort({ updatedAt: -1 })
    .limit(4)
    .lean();

  if (!docs.length) return null;

  const best = docs[0];
  const snippet =
    best.content.length > 900 ? `${best.content.slice(0, 900).trim()}…` : best.content;
  return `${best.title}\n\n${snippet}`;
}

module.exports = { searchKnowledge, escapeRegex };
