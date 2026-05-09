const multer = require("multer");

/** Same bucket name as previous GridFS uploads — existing files remain readable. */
const BUCKET_NAME = "productImages";

const FIVE_MB = 5 * 1024 * 1024;

const ALLOWED_MIMES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function createProductImageUpload() {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: FIVE_MB },
    fileFilter: (_req, file, cb) => {
      const mime = String(file.mimetype || "").toLowerCase();
      if (ALLOWED_MIMES.has(mime)) {
        cb(null, true);
        return;
      }
      const err = Object.assign(new Error("Only JPG, JPEG, PNG or WebP uploads are allowed"), {
        statusCode: 415,
        code: "unsupported_media_type",
      });
      cb(err, false);
    },
  });
}

function multerFriendlyError(err) {
  const code = String(err.code || "").toUpperCase();
  if (code === "LIMIT_FILE_SIZE") {
    return Object.assign(new Error("Image exceeds 5 MB limit"), {
      statusCode: 413,
      code: "payload_too_large",
    });
  }
  const msg = err.message ? String(err.message) : "";
  if (/Only JPG|allowed/i.test(msg)) {
    return Object.assign(err, {
      statusCode: 415,
      code: "unsupported_media_type",
    });
  }
  return Object.assign(err, {
    statusCode: 400,
    code: err.code === "LIMIT_UNEXPECTED_FILE" ? "invalid_upload" : "upload_error",
  });
}

function wrapUpload(uploadMiddleware) {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err && err.name === "MulterError") {
        next(multerFriendlyError(err));
        return;
      }
      next(err || undefined);
    });
  };
}

module.exports = {
  BUCKET_NAME,
  createProductImageUpload,
  wrapUpload,
};
