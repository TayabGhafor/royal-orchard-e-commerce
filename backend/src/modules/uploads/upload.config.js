const multer = require("multer");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");

/** GridFS bucket for product imagery (paired with GridFS downloads). */
const BUCKET_NAME = "productImages";

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const TEN_MB = 10 * 1024 * 1024;

function createGridFsEngine() {
  return new GridFsStorage({
    db: mongoose.connection,
    file: (_req, file) => ({
      bucketName: BUCKET_NAME,
      contentType: file.mimetype || "application/octet-stream",
      filename: `${Date.now()}-${String(file.originalname || "image").replace(/[^a-zA-Z0-9._-]+/g, "-")}`,
    }),
  });
}

function createProductImageUploader() {
  const storage = createGridFsEngine();
  return multer({
    storage,
    limits: { fileSize: TEN_MB },
    fileFilter: (_req, file, cb) => {
      const mime = String(file.mimetype || "").toLowerCase();
      if (ALLOWED.has(mime)) {
        cb(null, true);
        return;
      }
      const reject = Object.assign(new Error("Only JPG, PNG, WebP or SVG uploads are allowed"), {
        statusCode: 415,
        code: "unsupported_media_type",
      });
      cb(reject, false);
    },
  });
}

module.exports = {
  createProductImageUploader,
  BUCKET_NAME,
};
