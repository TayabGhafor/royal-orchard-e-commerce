const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { requireAdminKey } = require("../../middleware/admin-key.middleware");
const {
  chatbotQuery,
  listKnowledge,
  createKnowledge,
  uploadKnowledge,
  updateKnowledge,
  deleteKnowledge,
} = require("./chatbot.controller");

function ensureDir(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (_) {
    // ignore
  }
}

function knowledgeUploadMiddleware() {
  const uploadDir = path.join(__dirname, "../../../uploads/knowledge");
  ensureDir(uploadDir);

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
  const upload = knowledgeUploadMiddleware();

  router.post("/query", chatbotQuery(env));

  router.get("/knowledge", requireAdminKey(env), listKnowledge());
  router.post("/knowledge", requireAdminKey(env), createKnowledge());
  router.post("/knowledge/upload", requireAdminKey(env), upload.single("file"), uploadKnowledge());
  router.put("/knowledge/:id", requireAdminKey(env), updateKnowledge());
  router.delete("/knowledge/:id", requireAdminKey(env), deleteKnowledge());

  return router;
};
