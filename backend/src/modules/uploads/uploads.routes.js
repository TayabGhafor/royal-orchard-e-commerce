const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const { requireAdminKey } = require("../../middleware/admin-key.middleware");

function ensureDir(dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (_) {
    // ignore
  }
}

function makeUploadMiddleware() {
  const uploadDir = path.join(__dirname, "../../../uploads");
  ensureDir(uploadDir);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const safeBase = String(file.originalname || "image")
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const ext = path.extname(safeBase) || ".jpg";
      cb(null, `img-${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 5 },
    fileFilter: (_req, file, cb) => {
      const ok = ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype);
      cb(ok ? null : new Error("Only image uploads are allowed"), ok);
    },
  });
}

module.exports = (env) => {
  const router = express.Router();
  const upload = makeUploadMiddleware();

  router.post("/", requireAdminKey(env), upload.array("images", 5), (req, res) => {
    const files = Array.isArray(req.files) ? req.files : [];
    const urls = files.map((f) => `/uploads/${f.filename}`);
    res.status(201).json({ urls });
  });

  return router;
};

