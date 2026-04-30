const fs = require("fs");
const path = require("path");
const validator = require("validator");
const sanitizeHtml = require("sanitize-html");
const { ChatbotKnowledge } = require("./chatbot-knowledge.model");
const { buildReply } = require("./chatbot.service");

function sanitizeTitle(s) {
  return sanitizeHtml(validator.trim(String(s || "")), { allowedTags: [], allowedAttributes: {} }).slice(0, 200);
}

function sanitizeContent(s) {
  return sanitizeHtml(String(s || ""), { allowedTags: [], allowedAttributes: {} }).slice(0, 500_000);
}

function chatbotQuery(env) {
  return async (req, res, next) => {
    try {
      const message = validator.trim(String(req.body?.message || ""));
      if (!message) {
        throw Object.assign(new Error("message is required"), { statusCode: 400, code: "invalid_message" });
      }
      if (message.length > 2000) {
        throw Object.assign(new Error("message too long"), { statusCode: 400, code: "invalid_message" });
      }

      const reply = await buildReply(message, env);
      res.json({ reply });
    } catch (err) {
      next(err);
    }
  };
}

function listKnowledge() {
  return async (_req, res, next) => {
    try {
      const items = await ChatbotKnowledge.find({}).sort({ updatedAt: -1 }).lean();
      res.json({ items });
    } catch (err) {
      next(err);
    }
  };
}

function createKnowledge() {
  return async (req, res, next) => {
    try {
      const body = req.body || {};
      const title = sanitizeTitle(body.title);
      const content = sanitizeContent(body.content);
      const type = ["text", "pdf", "json"].includes(body.type) ? body.type : "text";

      if (!title) throw Object.assign(new Error("title is required"), { statusCode: 400, code: "invalid_title" });
      if (!content)
        throw Object.assign(new Error("content is required"), { statusCode: 400, code: "invalid_content" });

      const doc = await ChatbotKnowledge.create({ title, content, type });
      res.status(201).json({ item: doc.toObject() });
    } catch (err) {
      next(err);
    }
  };
}

async function extractPdfText(filePath) {
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    const pdfParse = require("pdf-parse");
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return String(data.text || "").trim();
  } catch (err) {
    throw Object.assign(new Error("Could not read PDF (install pdf-parse or upload text instead)"), {
      statusCode: 400,
      code: "pdf_extract_failed",
      cause: err,
    });
  }
}

function uploadKnowledge() {
  return async (req, res, next) => {
    try {
      const title = sanitizeTitle(req.body?.title);
      if (!title) throw Object.assign(new Error("title is required"), { statusCode: 400, code: "invalid_title" });

      const file = req.file;
      if (!file) throw Object.assign(new Error("file is required"), { statusCode: 400, code: "invalid_file" });

      const ext = path.extname(file.originalname || "").toLowerCase();
      let content = "";
      let type = "text";

      if (ext === ".pdf" || file.mimetype === "application/pdf") {
        content = await extractPdfText(file.path);
        type = "pdf";
      } else if (ext === ".json" || file.mimetype === "application/json") {
        const raw = fs.readFileSync(file.path, "utf8");
        try {
          content = JSON.stringify(JSON.parse(raw), null, 2);
        } catch {
          content = sanitizeContent(raw);
        }
        type = "json";
      } else if (ext === ".txt" || file.mimetype.startsWith("text/")) {
        content = sanitizeContent(fs.readFileSync(file.path, "utf8"));
        type = "text";
      } else {
        fs.unlink(file.path, () => {});
        throw Object.assign(new Error("Unsupported file type"), { statusCode: 400, code: "invalid_file_type" });
      }

      if (!content || content.length < 10) {
        fs.unlink(file.path, () => {});
        throw Object.assign(new Error("Extracted content too short"), { statusCode: 400, code: "empty_extract" });
      }

      const doc = await ChatbotKnowledge.create({
        title,
        content: content.slice(0, 500_000),
        type,
        sourceFile: file.originalname || file.filename,
      });

      fs.unlink(file.path, () => {});

      res.status(201).json({ item: doc.toObject() });
    } catch (err) {
      next(err);
    }
  };
}

function updateKnowledge() {
  return async (req, res, next) => {
    try {
      const id = String(req.params.id || "");
      const body = req.body || {};
      const patch = {};
      if (body.title !== undefined) patch.title = sanitizeTitle(body.title);
      if (body.content !== undefined) patch.content = sanitizeContent(body.content);
      if (body.type !== undefined && ["text", "pdf", "json"].includes(body.type)) patch.type = body.type;

      const doc = await ChatbotKnowledge.findByIdAndUpdate(id, patch, { new: true, runValidators: true }).lean();
      if (!doc) throw Object.assign(new Error("Not found"), { statusCode: 404, code: "not_found" });
      res.json({ item: doc });
    } catch (err) {
      next(err);
    }
  };
}

function deleteKnowledge() {
  return async (req, res, next) => {
    try {
      const id = String(req.params.id || "");
      const r = await ChatbotKnowledge.findByIdAndDelete(id);
      if (!r) throw Object.assign(new Error("Not found"), { statusCode: 404, code: "not_found" });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  chatbotQuery,
  listKnowledge,
  createKnowledge,
  uploadKnowledge,
  updateKnowledge,
  deleteKnowledge,
};
