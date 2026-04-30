const mongoose = require("mongoose");

const ChatbotKnowledgeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200, index: true },
    content: { type: String, required: true, maxlength: 500_000 },
    type: { type: String, enum: ["text", "pdf", "json"], required: true, default: "text", index: true },
    /** Original filename for PDF uploads */
    sourceFile: { type: String, trim: true, maxlength: 260 },
  },
  { timestamps: true },
);

const ChatbotKnowledge =
  mongoose.models.ChatbotKnowledge || mongoose.model("ChatbotKnowledge", ChatbotKnowledgeSchema);

module.exports = { ChatbotKnowledge };
