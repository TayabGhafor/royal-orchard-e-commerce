const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { requireAdminKey } = require("../../middleware/admin-key.middleware");
const {
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
} = require("./chat.controller");
const {
  listKnowledge,
  createKnowledge,
  uploadKnowledge,
  updateKnowledge,
  deleteKnowledge,
} = require("../chatbot/chatbot.controller");

function knowledgeUploadMiddleware() {
  const uploadDir = path.join(__dirname, "../../../uploads/knowledge");
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch {
    // ignore
  }
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "") || ".bin";
      cb(null, `kb-${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`);
    },
  });
  return multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ok =
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/json" ||
        file.mimetype === "text/plain" ||
        file.mimetype === "text/markdown" ||
        file.originalname?.toLowerCase().endsWith(".pdf") ||
        file.originalname?.toLowerCase().endsWith(".json") ||
        file.originalname?.toLowerCase().endsWith(".txt");
      cb(ok ? null : new Error("Only PDF, JSON, or text files are allowed"), ok);
    },
  });
}

module.exports = (env) => {
  const router = express.Router();
  const opt = optionalAuthMiddleware(env);
  const upload = knowledgeUploadMiddleware();

  router.get("/search", opt, chatSearch());
  router.get("/suggestions", chatSuggestions());
  router.get("/recommendations", opt, chatRecommendations());
  router.get("/order-status", authMiddleware(env), chatOrderStatus());
  router.post("/cart-action", opt, chatCartAction());
  router.post("/faq", chatFaq());
  router.post("/activity", opt, chatActivity());
  router.post("/query", opt, chatQuery(env));

  router.get("/knowledge", requireAdminKey(env), listKnowledge());
  router.post("/knowledge", requireAdminKey(env), createKnowledge());
  router.post("/knowledge/upload", requireAdminKey(env), upload.single("file"), uploadKnowledge());
  router.put("/knowledge/:id", requireAdminKey(env), updateKnowledge());
  router.delete("/knowledge/:id", requireAdminKey(env), deleteKnowledge());

  return router;
};
