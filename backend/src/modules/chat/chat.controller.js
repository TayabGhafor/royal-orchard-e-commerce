const validator = require("validator");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { optionalAuthMiddleware } = require("../../middleware/optional-auth.middleware");
const { searchProducts } = require("./chat-search.service");
const { getSuggestions } = require("./chat-suggestions.service");
const { getRecommendations } = require("./chat-recommendations.service");
const { getOrderStatusForUser } = require("./chat-order.service");
const { parseCartAction } = require("./chat-cart.service");
const { answerFaq } = require("./chat-faq.service");
const { recordActivity } = require("./chat-activity.service");
const { buildOrchestratedReply } = require("./chat-orchestrator.service");

function ctxFromReq(req) {
  return {
    userId: req.user?.userId,
    guestSessionId: req.guestSessionId,
  };
}

function chatSearch() {
  return async (req, res, next) => {
    try {
      const q = validator.trim(String(req.query.q || ""));
      if (!q) {
        throw Object.assign(new Error("q is required"), { statusCode: 400, code: "invalid_query" });
      }
      const result = await searchProducts(q, { limit: Number(req.query.limit) || 12 });
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

function chatSuggestions() {
  return async (req, res, next) => {
    try {
      const q = String(req.query.q || "");
      const result = await getSuggestions(q, { limit: Number(req.query.limit) || 8 });
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

function chatRecommendations() {
  return async (req, res, next) => {
    try {
      const section = String(req.query.section || "trending");
      const productId = req.query.productId ? String(req.query.productId) : undefined;
      const limit = Number(req.query.limit) || 8;
      const result = await getRecommendations(ctxFromReq(req), section, { productId, limit });
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

function chatOrderStatus() {
  return async (req, res, next) => {
    try {
      if (!req.user?.userId) {
        throw Object.assign(new Error("Sign in to track orders"), { statusCode: 401, code: "unauthorized" });
      }
      const orderId = req.query.orderId ? String(req.query.orderId) : undefined;
      const result = await getOrderStatusForUser(req.user.userId, { orderId });
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

function chatCartAction() {
  return async (req, res, next) => {
    try {
      const message = validator.trim(String(req.body?.message || ""));
      if (!message) {
        throw Object.assign(new Error("message is required"), { statusCode: 400, code: "invalid_message" });
      }
      const result = (await parseCartAction(message)) || {
        action: "none",
        reply: 'Try "Add 5kg Chaunsa" or "Apply SUMMER10".',
      };
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

function chatFaq() {
  return async (req, res, next) => {
    try {
      const question = validator.trim(String(req.body?.question || req.body?.message || ""));
      if (!question) {
        throw Object.assign(new Error("question is required"), { statusCode: 400, code: "invalid_question" });
      }
      const result = await answerFaq(question);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

function chatActivity() {
  return async (req, res, next) => {
    try {
      const productId = String(req.body?.productId || "");
      const type = String(req.body?.type || "");
      const result = await recordActivity({
        userId: req.user?.userId,
        guestSessionId: req.guestSessionId || req.body?.guestSessionId,
        productId,
        type,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

function chatQuery(env) {
  return async (req, res, next) => {
    try {
      const message = validator.trim(String(req.body?.message || ""));
      if (!message) {
        throw Object.assign(new Error("message is required"), { statusCode: 400, code: "invalid_message" });
      }
      if (message.length > 2000) {
        throw Object.assign(new Error("message too long"), { statusCode: 400, code: "invalid_message" });
      }
      const payload = await buildOrchestratedReply(message, env, ctxFromReq(req));
      res.json(payload);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  chatSearch,
  chatSuggestions,
  chatRecommendations,
  chatOrderStatus,
  chatCartAction,
  chatFaq,
  chatActivity,
  chatQuery,
  authMiddleware,
  optionalAuthMiddleware,
};
