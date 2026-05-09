/**
 * Streams use mongodb driver's GridFSBucket (same buckets as multer-gridfs-storage).
 * The gridfs-stream package relies on mongo.GridStore, which newer drivers removed.
 */
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const { BUCKET_NAME } = require("./upload.config");

function multerFriendlyError(err) {
  const code = String(err.code || "").toUpperCase();
  if (code === "LIMIT_FILE_SIZE") {
    return Object.assign(new Error("Image exceeds 10 MB limit"), {
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

function postProductImage(req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      throw Object.assign(new Error("Missing image — use multipart field name \"image\""), {
        statusCode: 400,
        code: "missing_file",
      });
    }
    const id = file.id;
    const imageId = id != null ? String(id) : "";
    if (!mongoose.isValidObjectId(imageId)) {
      throw Object.assign(new Error("Upload did not persist a GridFS id"), {
        statusCode: 500,
        code: "upload_store_failed",
      });
    }

    const imageUrl = `/api/uploads/image/${imageId}`;
    res.status(201).json({ imageId, imageUrl });
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

    const readStream = bucket.openDownloadStream(oid);
    readStream.on("error", () => {
      if (!res.headersSent) {
        res.sendStatus(404);
      } else if (!readStream.writableEnded) {
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
  wrapUpload,
  postProductImage,
  streamProductImage,
};
