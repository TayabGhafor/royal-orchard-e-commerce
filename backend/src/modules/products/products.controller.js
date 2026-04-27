const validator = require("validator");
const sanitizeHtml = require("sanitize-html");
const { Product } = require("./product.model");

function sanitizeText(s) {
  const trimmed = validator.trim(String(s || ""));
  return sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} });
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
      const title = sanitizeText(body.title);
      const variety = sanitizeText(body.variety);
      const collection = sanitizeText(body.collection);
      const pricePerKg = Number(body.pricePerKg);

      if (!title) throw Object.assign(new Error("Title is required"), { statusCode: 400, code: "invalid_title" });
      if (!["Sindhri", "Chaunsa", "Anwar Ratol", "Langra"].includes(variety))
        throw Object.assign(new Error("Invalid variety"), { statusCode: 400, code: "invalid_variety" });
      if (!["Premium", "Seasonal", "Organic"].includes(collection))
        throw Object.assign(new Error("Invalid collection"), { statusCode: 400, code: "invalid_collection" });
      if (!Number.isFinite(pricePerKg) || pricePerKg < 0)
        throw Object.assign(new Error("Invalid pricePerKg"), { statusCode: 400, code: "invalid_price" });

      const product = await Product.create({
        title,
        tagline: sanitizeText(body.tagline),
        description: sanitizeText(body.description),
        variety,
        collection,
        pricePerKg,
        weights: Array.isArray(body.weights) ? body.weights.map(Number).filter((n) => Number.isFinite(n)) : [3, 5, 8],
        stock: Number.isFinite(Number(body.stock)) ? Math.max(0, Number(body.stock)) : 0,
        images: Array.isArray(body.images) ? body.images.map((s) => sanitizeText(s)).filter(Boolean) : [],
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

      setIf("title", body.title !== undefined ? sanitizeText(body.title) : undefined);
      setIf("tagline", body.tagline !== undefined ? sanitizeText(body.tagline) : undefined);
      setIf("description", body.description !== undefined ? sanitizeText(body.description) : undefined);
      if (body.variety !== undefined) setIf("variety", sanitizeText(body.variety));
      if (body.collection !== undefined) setIf("collection", sanitizeText(body.collection));
      if (body.pricePerKg !== undefined) setIf("pricePerKg", Number(body.pricePerKg));
      if (body.weights !== undefined)
        setIf(
          "weights",
          Array.isArray(body.weights) ? body.weights.map(Number).filter((n) => Number.isFinite(n)) : undefined,
        );
      if (body.stock !== undefined) setIf("stock", Math.max(0, Number(body.stock)));
      if (body.images !== undefined)
        setIf("images", Array.isArray(body.images) ? body.images.map((s) => sanitizeText(s)).filter(Boolean) : []);
      if (body.isActive !== undefined) setIf("isActive", Boolean(body.isActive));

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

