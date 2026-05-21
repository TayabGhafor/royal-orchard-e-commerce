const { Blog } = require("./blog.model");

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base) {
  let slug = slugify(base) || "post";
  let n = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const candidate = n ? `${slug}-${n}` : slug;
    // eslint-disable-next-line no-await-in-loop
    const exists = await Blog.findOne({ slug: candidate }).select("_id").lean();
    if (!exists) return candidate;
    n += 1;
  }
}

function serializeBlog(doc) {
  if (!doc) return null;
  const b = doc.toObject ? doc.toObject() : doc;
  return {
    _id: String(b._id),
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt || "",
    content: b.content,
    thumbnail: b.thumbnail || "",
    author: b.author || "Royal Orchard Editorial",
    tags: b.tags || [],
    readTimeMinutes: b.readTimeMinutes || 5,
    status: b.status,
    publishedAt: b.publishedAt,
    isSeedData: Boolean(b.isSeedData),
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}

function listPublished() {
  return async (_req, res, next) => {
    try {
      const items = await Blog.find({ status: "published" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .select("-content")
        .lean();
      res.json({ items: items.map(serializeBlog) });
    } catch (err) {
      next(err);
    }
  };
}

function getBySlug() {
  return async (req, res, next) => {
    try {
      const blog = await Blog.findOne({ slug: req.params.slug, status: "published" });
      if (!blog) {
        return res.status(404).json({ error: { code: "not_found", message: "Blog not found" } });
      }
      res.json({ blog: serializeBlog(blog) });
    } catch (err) {
      next(err);
    }
  };
}

function listAdmin() {
  return async (_req, res, next) => {
    try {
      const items = await Blog.find().sort({ updatedAt: -1 }).lean();
      res.json({ items: items.map(serializeBlog) });
    } catch (err) {
      next(err);
    }
  };
}

function createBlog() {
  return async (req, res, next) => {
    try {
      const { title, excerpt, content, thumbnail, author, tags, readTimeMinutes, publishedAt, status } =
        req.body || {};
      if (!title?.trim() || !content?.trim()) {
        return res.status(400).json({ error: { code: "validation", message: "Title and content are required" } });
      }
      const slug = await uniqueSlug(title);
      const isPublished = status === "published";
      const blog = await Blog.create({
        title: title.trim(),
        slug,
        excerpt: (excerpt || "").trim(),
        content,
        thumbnail: thumbnail || "",
        author: (author || "Royal Orchard Editorial").trim(),
        tags: Array.isArray(tags) ? tags : [],
        readTimeMinutes: Number(readTimeMinutes) || 5,
        status: isPublished ? "published" : "draft",
        publishedAt: isPublished ? publishedAt || new Date() : null,
      });
      res.status(201).json({ blog: serializeBlog(blog) });
    } catch (err) {
      next(err);
    }
  };
}

function updateBlog() {
  return async (req, res, next) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: { code: "not_found", message: "Blog not found" } });
      }
      const { title, excerpt, content, thumbnail, author, tags, readTimeMinutes, publishedAt, status } =
        req.body || {};
      if (title?.trim() && title.trim() !== blog.title) {
        blog.title = title.trim();
        if (!blog.isSeedData) {
          blog.slug = await uniqueSlug(title);
        }
      }
      if (excerpt !== undefined) blog.excerpt = String(excerpt).trim();
      if (content !== undefined) blog.content = content;
      if (thumbnail !== undefined) blog.thumbnail = thumbnail;
      if (author !== undefined) blog.author = String(author).trim();
      if (tags !== undefined) blog.tags = Array.isArray(tags) ? tags : blog.tags;
      if (readTimeMinutes !== undefined) blog.readTimeMinutes = Number(readTimeMinutes) || 5;
      if (publishedAt !== undefined) blog.publishedAt = publishedAt ? new Date(publishedAt) : blog.publishedAt;
      if (status === "published") {
        blog.status = "published";
        if (!blog.publishedAt) blog.publishedAt = publishedAt ? new Date(publishedAt) : new Date();
      } else if (status === "draft") {
        blog.status = "draft";
      }
      await blog.save();
      res.json({ blog: serializeBlog(blog) });
    } catch (err) {
      next(err);
    }
  };
}

function publishBlog() {
  return async (req, res, next) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: { code: "not_found", message: "Blog not found" } });
      }
      blog.status = "published";
      blog.publishedAt = req.body?.publishedAt ? new Date(req.body.publishedAt) : blog.publishedAt || new Date();
      await blog.save();
      res.json({ blog: serializeBlog(blog) });
    } catch (err) {
      next(err);
    }
  };
}

function deleteBlog() {
  return async (req, res, next) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: { code: "not_found", message: "Blog not found" } });
      }
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  listPublished,
  getBySlug,
  listAdmin,
  createBlog,
  updateBlog,
  publishBlog,
  deleteBlog,
};
