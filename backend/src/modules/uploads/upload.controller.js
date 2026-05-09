const { Readable } = require("stream");
const { finished } = require("stream/promises");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const { BUCKET_NAME } = require("./upload.middleware");

function safeFilename(name) {
  return String(name || "image").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 180) || "image";
}

/**
 * Public origin for absolute image URLs (Render sets RENDER_EXTERNAL_URL).
 * Optional API_PUBLIC_URL wins for custom domains.
 */
function resolvePublicOrigin(req, env) {
  const explicit = String(env.API_PUBLIC_URL || "").trim().replace(/\/+$/, "");
  if (explicit) return explicit;
  const xfProto = req.get("x-forwarded-proto");
  const proto = xfProto ? xfProto.split(",")[0].trim() : req.protocol;
  const host = req.get("host");
  if (host) return `${proto}://${host}`;
  return "";
}

function buildImageUrl(req, env, fileId) {
  const origin = resolvePublicOrigin(req, env);
  const path = `/api/uploads/image/${fileId}`;
  if (origin) return `${origin}${path}`;
  return path;
}

async function postProductImage(req, res, next) {
  try {
    const file = req.file;
    const env = req.app.get("envConfig") || {};

    if (!file || !file.buffer) {
      throw Object.assign(new Error('Missing image — use multipart field name "image"'), {
        statusCode: 400,
        code: "missing_file",
      });
    }

    if (!mongoose.connection.db) {
      throw Object.assign(new Error("Database not ready"), {
        statusCode: 503,
        code: "gridfs_unavailable",
      });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME });
    const filename = `${Date.now()}-${safeFilename(file.originalname)}`;
    const contentType = String(file.mimetype || "application/octet-stream").trim() || "application/octet-stream";

    const uploadStream = bucket.openUploadStream(filename, { contentType });
    Readable.from(file.buffer).pipe(uploadStream);

    await finished(uploadStream);

    const id = uploadStream.id;
    const fileId = id != null ? String(id) : "";
    if (!mongoose.isValidObjectId(fileId)) {
      throw Object.assign(new Error("Upload did not persist a GridFS id"), {
        statusCode: 500,
        code: "upload_store_failed",
      });
    }

    const url = buildImageUrl(req, env, fileId);

    res.status(201).json({
      fileId,
      url,
      imageId: fileId,
      imageUrl: url,
    });
  } catch (err) {
    next(err);
  }
}

async function streamProductImage(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: { code: "invalid_id", message: "Invalid image id" } });
      return;
    }

    if (!mongoose.connection.db) {
      throw Object.assign(new Error("Database not ready"), {
        statusCode: 503,
        code: "gridfs_unavailable",
      });
    }

    const oid = new mongoose.Types.ObjectId(id);
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME });
    const files = await bucket.find({ _id: oid }).limit(1).toArray();

    if (!files.length) {
      res.status(404).json({ error: { code: "not_found", message: "Image not found" } });
      return;
    }

    const fileDoc = files[0];
    const mime = String(fileDoc.contentType || "").trim();
    const contentType = mime && mime !== "" ? mime : "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    /** Embed in admin/storefront `<img>` from another origin (pair with Helmet CORP). */
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Cache-Control", "public, max-age=86400");

    const readStream = bucket.openDownloadStream(oid);
    readStream.on("error", () => {
      if (!res.headersSent) {
        res.sendStatus(404);
      } else {
        try {
          res.end();
        } catch (_) {
          // ignore
        }
      }
    });
    readStream.pipe(res);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postProductImage,
  streamProductImage,
};
