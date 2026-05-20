const { buildOrchestratedReply, FALLBACK } = require("../chat/chat-orchestrator.service");

/**
 * @param {string} message
 * @param {object} env from loadEnv
 * @param {{ userId?: string, guestSessionId?: string }} [ctx]
 */
async function buildReply(message, env, ctx = {}) {
  const payload = await buildOrchestratedReply(message, env, ctx);
  return payload;
}

module.exports = {
  buildReply,
  FALLBACK,
};
