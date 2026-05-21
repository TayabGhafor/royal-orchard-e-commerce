const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, trim: true, default: "" },
    content: { type: String, required: true },
    thumbnail: { type: String, trim: true, default: "" },
    author: { type: String, trim: true, default: "Royal Orchard Editorial" },
    tags: { type: [String], default: [] },
    readTimeMinutes: { type: Number, default: 5, min: 1 },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: { type: Date, default: null, index: true },
    isSeedData: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = { Blog };
