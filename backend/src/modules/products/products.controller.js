const validator = require("validator");
const sanitizeHtml = require("sanitize-html");
const { Product } = require("./product.model");

function sanitizeText(s) {
  const trimmed = validator.trim(String(s || ""));
  return sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} });
}

function slugify(s) {
  const base = sanitizeText(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || `prod-${Date.now()}`;
}

async function uniqueSlugForName(name) {
  const base = slugify(name);
  let slug = base;
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < 1000; i++) {
    // eslint-disable-next-line no-await-in-loop
    const exists = await Product.exists({ slug });
    if (!exists) return slug;
    slug = `${base}-${i + 1}`;
  }
  return `${base}-${Date.now()}`;
}

function parsePagination(req) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function listProducts() {
  return async (req, res, next) => {
    try {
      const { skip, limit, page } = parsePagination(req);
      const filter = {};
      if (req.query.active !== undefined) filter.isActive = String(req.query.active) === "true";
      if (req.query.variety) filter.variety = String(req.query.variety);
      if (req.query.collection) filter.collection = String(req.query.collection);

      const [items, total] = await Promise.all([
        Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Product.countDocuments(filter),
      ]);

      res.json({ page, limit, total, items });
    } catch (err) {
      next(err);
    }
  };
}

function getProduct() {
  return async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).lean();
      if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404, code: "product_not_found" });
      res.json({ product });
    } catch (err) {
      next(err);
    }
  };
}

function createProduct() {
  return async (req, res, next) => {
    try {
      const body = req.body || {};
      const name = sanitizeText(body.name);
      const variety = sanitizeText(body.variety);
      const collection = sanitizeText(body.collection);
      const price = Number(body.price);

      if (!name) throw Object.assign(new Error("Name is required"), { statusCode: 400, code: "invalid_name" });
      if (!["Sindhri", "Chaunsa", "Anwar Ratol", "Langra", "Mixed", "Other"].includes(variety))
        throw Object.assign(new Error("Invalid variety"), { statusCode: 400, code: "invalid_variety" });
      if (!["Premium Reserve", "Seasonal Specials", "Bulk Harvest"].includes(collection))
        throw Object.assign(new Error("Invalid collection"), { statusCode: 400, code: "invalid_collection" });
      if (!Number.isFinite(price) || price < 0)
        throw Object.assign(new Error("Invalid price"), { statusCode: 400, code: "invalid_price" });

      const images = Array.isArray(body.images) ? body.images.map((s) => sanitizeText(s)).filter(Boolean) : [];
      if (images.length < 1) throw Object.assign(new Error("At least 1 image required"), { statusCode: 400, code: "invalid_images" });
      if (images.length > 5) throw Object.assign(new Error("Max 5 images allowed"), { statusCode: 400, code: "invalid_images" });

      const weightsRaw = Array.isArray(body.weights) ? body.weights.map((s) => sanitizeText(s)).filter(Boolean) : ["3kg", "5kg", "8kg"];
      const weights = weightsRaw.filter((w) => ["3kg", "5kg", "8kg"].includes(w));
      if (weights.length === 0) throw Object.assign(new Error("Invalid weights"), { statusCode: 400, code: "invalid_weights" });

      const product = await Product.create({
        name,
        slug: await uniqueSlugForName(name),
        tagline: sanitizeText(body.tagline),
        description: sanitizeText(body.description),
        variety,
        collection,
        price,
        weights,
        stock: Number.isFinite(Number(body.stock)) ? Math.max(0, Number(body.stock)) : 0,
        images,
        rating: Number.isFinite(Number(body.rating)) ? Math.max(0, Math.min(5, Number(body.rating))) : 4.5,
        reviews: Number.isFinite(Number(body.reviews)) ? Math.max(0, Number(body.reviews)) : 0,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      });

      res.status(201).json({ product });
    } catch (err) {
      next(err);
    }
  };
}

function updateProduct() {
  return async (req, res, next) => {
    try {
      const body = req.body || {};
      const patch = {};
      const setIf = (key, value) => {
        if (value !== undefined) patch[key] = value;
      };

      setIf("name", body.name !== undefined ? sanitizeText(body.name) : undefined);
      if (body.slug !== undefined) setIf("slug", sanitizeText(body.slug));
      setIf("tagline", body.tagline !== undefined ? sanitizeText(body.tagline) : undefined);
      setIf("description", body.description !== undefined ? sanitizeText(body.description) : undefined);
      if (body.variety !== undefined) setIf("variety", sanitizeText(body.variety));
      if (body.collection !== undefined) setIf("collection", sanitizeText(body.collection));
      if (body.price !== undefined) setIf("price", Number(body.price));
      if (body.weights !== undefined)
        setIf(
          "weights",
          Array.isArray(body.weights)
            ? body.weights.map((s) => sanitizeText(s)).filter((w) => ["3kg", "5kg", "8kg"].includes(w))
            : undefined,
        );
      if (body.stock !== undefined) setIf("stock", Math.max(0, Number(body.stock)));
      if (body.images !== undefined)
        setIf("images", Array.isArray(body.images) ? body.images.map((s) => sanitizeText(s)).filter(Boolean) : []);
      if (body.rating !== undefined) setIf("rating", Math.max(0, Math.min(5, Number(body.rating))));
      if (body.reviews !== undefined) setIf("reviews", Math.max(0, Number(body.reviews)));
      if (body.isActive !== undefined) setIf("isActive", Boolean(body.isActive));

      // If name changed and slug not provided, regenerate slug.
      if (patch.name && !patch.slug) {
        patch.slug = await uniqueSlugForName(patch.name);
      }

      const product = await Product.findByIdAndUpdate(req.params.id, { $set: patch }, { new: true }).lean();
      if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404, code: "product_not_found" });
      res.json({ product });
    } catch (err) {
      next(err);
    }
  };
}

function deleteProduct() {
  return async (req, res, next) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id).lean();
      if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404, code: "product_not_found" });
      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };

