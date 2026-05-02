const validator = require("validator");
const sanitizeHtml = require("sanitize-html");
const mongoose = require("mongoose");

const { Order } = require("./order.model");
const { Product } = require("../products/product.model");

function sanitizeText(s) {
  const trimmed = validator.trim(String(s || ""));
  return sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} });
}

function weightToKg(weight) {
  const w = String(weight || "").trim().toLowerCase();
  if (w === "3kg" || w === "3") return 3;
  if (w === "5kg" || w === "5") return 5;
  if (w === "8kg" || w === "8") return 8;
  return null;
}

function unitPriceForWeightKg(product, weightKg) {
  const key = `${weightKg}kg`;
  const wp = product.weightPrices;
  if (wp && typeof wp === "object" && Number.isFinite(Number(wp[key]))) {
    return Number(wp[key]);
  }
  if (Number.isFinite(Number(product.price))) {
    return Number(product.price);
  }
  return null;
}

function parsePagination(req) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

function assertStatusFlow(from, to) {
  const flow = ["Placed", "Processing", "Shipped", "Delivered"];
  if (from === to) return true;
  if (!flow.includes(from) || !flow.includes(to)) return false;
  return flow.indexOf(to) === flow.indexOf(from) + 1;
}

function createOrder() {
  return async (req, res, next) => {
    try {
      const body = req.body || {};
      const items = Array.isArray(body.items) ? body.items : [];

      if (items.length === 0) throw Object.assign(new Error("Order items required"), { statusCode: 400, code: "invalid_items" });

      const deliveryDetails = {
        name: sanitizeText(body.deliveryDetails?.name),
        phone: sanitizeText(body.deliveryDetails?.phone),
        address: sanitizeText(body.deliveryDetails?.address),
      };
      if (!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address) {
        throw Object.assign(new Error("Delivery details required"), { statusCode: 400, code: "invalid_delivery_details" });
      }

      const paymentMethod = sanitizeText(body.paymentMethod);
      if (!["COD", "Easypaisa", "JazzCash", "Card"].includes(paymentMethod)) {
        throw Object.assign(new Error("Invalid payment method"), { statusCode: 400, code: "invalid_payment_method" });
      }
      const paymentStatus = paymentMethod === "COD" ? "Unpaid" : "Paid";

      // Build order items with server-side prices; only "In Stock" products can be purchased.
      // If anything fails mid-way, roll back applied totalSold increments.
      const applied = [];
      const builtItems = [];
      let subtotal = 0;

      try {
        for (const raw of items) {
          const productId = String(raw.product || "");
          const weight = Number(raw.weight);
          const quantity = Number(raw.quantity);

          if (!mongoose.isValidObjectId(productId)) {
            throw Object.assign(new Error("Invalid product"), { statusCode: 400, code: "invalid_product" });
          }
          if (!Number.isFinite(weight) || ![3, 5, 8].includes(weight)) {
            throw Object.assign(new Error("Invalid weight"), { statusCode: 400, code: "invalid_weight" });
          }
          if (!Number.isInteger(quantity) || quantity < 1) {
            throw Object.assign(new Error("Invalid quantity"), { statusCode: 400, code: "invalid_quantity" });
          }

          const product = await Product.findOneAndUpdate(
            { _id: productId, isActive: true, availabilityStatus: "In Stock" },
            { $inc: { totalSold: quantity } },
            { returnDocument: "after" },
          ).lean();

          if (!product) {
            throw Object.assign(new Error("Product unavailable"), { statusCode: 409, code: "out_of_stock" });
          }
          if (!Array.isArray(product.weights) || !product.weights.includes(`${weight}kg`)) {
            throw Object.assign(new Error("Invalid weight for this product"), { statusCode: 400, code: "invalid_weight" });
          }

          applied.push({ productId, quantity });

          const price = unitPriceForWeightKg(product, weight);
          if (price == null || !Number.isFinite(price)) {
            throw Object.assign(new Error("Missing price for selected weight"), { statusCode: 409, code: "invalid_price" });
          }
          subtotal += price * quantity;

          builtItems.push({
            product: product._id,
            title: product.name,
            image: product.images?.[0] || "",
            weight,
            quantity,
            price,
          });
        }

        const shipping = Number.isFinite(Number(body.pricing?.shipping)) ? Math.max(0, Number(body.pricing.shipping)) : 0;
        const tax = Number.isFinite(Number(body.pricing?.tax)) ? Math.max(0, Number(body.pricing.tax)) : 0;
        const total = subtotal + shipping + tax;

        const order = await Order.create({
          user: req.user.userId,
          items: builtItems,
          deliveryDetails,
          paymentMethod,
          paymentStatus,
          orderStatus: "Placed",
          pricing: { subtotal, shipping, tax, total },
          timeline: [{ status: "Placed", date: new Date() }],
          returnRequest: { status: "None" },
        });

        res.status(201).json({ order });
      } catch (err) {
        // Rollback applied decrements best-effort
        // eslint-disable-next-line no-restricted-syntax
        for (const a of applied) {
          // eslint-disable-next-line no-await-in-loop
          await Product.findByIdAndUpdate(a.productId, { $inc: { totalSold: -a.quantity } });
        }
        throw err;
      }
    } catch (err) {
      next(err);
    }
  };
}

function createGuestOrder() {
  return async (req, res, next) => {
    try {
      const body = req.body || {};
      const items = Array.isArray(body.items) ? body.items : [];

      if (items.length === 0) throw Object.assign(new Error("Order items required"), { statusCode: 400, code: "invalid_items" });

      const deliveryDetails = {
        name: sanitizeText(body.deliveryDetails?.name),
        phone: sanitizeText(body.deliveryDetails?.phone),
        address: sanitizeText(body.deliveryDetails?.address),
      };
      if (!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address) {
        throw Object.assign(new Error("Delivery details required"), { statusCode: 400, code: "invalid_delivery_details" });
      }

      const paymentMethod = sanitizeText(body.paymentMethod);
      if (!["COD", "Easypaisa", "JazzCash", "Card"].includes(paymentMethod)) {
        throw Object.assign(new Error("Invalid payment method"), { statusCode: 400, code: "invalid_payment_method" });
      }
      const paymentStatus = paymentMethod === "COD" ? "Unpaid" : "Paid";

      const guestEmail = sanitizeText(body.guest?.email || body.email);
      const applied = [];
      const builtItems = [];
      let subtotal = 0;

      try {
        for (const raw of items) {
          const productId = String(raw.product || "");
          const weightKg = weightToKg(raw.weight);
          const quantity = Number(raw.quantity);

          if (!mongoose.isValidObjectId(productId)) {
            throw Object.assign(new Error("Invalid product"), { statusCode: 400, code: "invalid_product" });
          }
          if (!weightKg || ![3, 5, 8].includes(weightKg)) {
            throw Object.assign(new Error("Invalid weight"), { statusCode: 400, code: "invalid_weight" });
          }
          if (!Number.isInteger(quantity) || quantity < 1) {
            throw Object.assign(new Error("Invalid quantity"), { statusCode: 400, code: "invalid_quantity" });
          }

          const product = await Product.findOneAndUpdate(
            { _id: productId, isActive: true, availabilityStatus: "In Stock" },
            { $inc: { totalSold: quantity } },
            { returnDocument: "after" },
          ).lean();

          if (!product) {
            throw Object.assign(new Error("Product unavailable"), { statusCode: 409, code: "out_of_stock" });
          }
          if (!Array.isArray(product.weights) || !product.weights.includes(`${weightKg}kg`)) {
            throw Object.assign(new Error("Invalid weight for this product"), { statusCode: 400, code: "invalid_weight" });
          }

          applied.push({ productId, quantity });
          const price = unitPriceForWeightKg(product, weightKg);
          if (price == null || !Number.isFinite(price)) {
            throw Object.assign(new Error("Missing price for selected weight"), { statusCode: 409, code: "invalid_price" });
          }
          subtotal += price * quantity;

          builtItems.push({
            product: product._id,
            title: product.name,
            image: product.images?.[0] || "",
            weight: weightKg,
            quantity,
            price,
          });
        }

        const shipping = Number.isFinite(Number(body.pricing?.shipping)) ? Math.max(0, Number(body.pricing.shipping)) : 0;
        const tax = Number.isFinite(Number(body.pricing?.tax)) ? Math.max(0, Number(body.pricing.tax)) : 0;
        const total = subtotal + shipping + tax;

        const order = await Order.create({
          guest: { name: deliveryDetails.name, email: guestEmail || undefined },
          items: builtItems,
          deliveryDetails,
          paymentMethod,
          paymentStatus,
          orderStatus: "Placed",
          pricing: { subtotal, shipping, tax, total },
          timeline: [{ status: "Placed", date: new Date() }],
          returnRequest: { status: "None" },
        });

        res.status(201).json({ order });
      } catch (err) {
        // Rollback applied decrements best-effort
        // eslint-disable-next-line no-restricted-syntax
        for (const a of applied) {
          // eslint-disable-next-line no-await-in-loop
          await Product.findByIdAndUpdate(a.productId, { $inc: { totalSold: -a.quantity } });
        }
        throw err;
      }
    } catch (err) {
      next(err);
    }
  };
}

function myOrders() {
  return async (req, res, next) => {
    try {
      const { skip, limit, page } = parsePagination(req);
      const filter = { user: req.user.userId };
      const [items, total] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Order.countDocuments(filter),
      ]);
      res.json({ page, limit, total, items });
    } catch (err) {
      next(err);
    }
  };
}

function getOrder() {
  return async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        throw Object.assign(new Error("Invalid order id"), { statusCode: 400, code: "invalid_order_id" });
      }
      const order = await Order.findById(req.params.id).lean();
      if (!order) throw Object.assign(new Error("Order not found"), { statusCode: 404, code: "order_not_found" });

      const isOwner = String(order.user) === String(req.user.userId);
      const isAdmin = req.user.role === "admin";
      if (!isOwner && !isAdmin) throw Object.assign(new Error("Forbidden"), { statusCode: 403, code: "forbidden" });

      res.json({ order });
    } catch (err) {
      next(err);
    }
  };
}

function cancelOrder() {
  return async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        throw Object.assign(new Error("Invalid order id"), { statusCode: 400, code: "invalid_order_id" });
      }

      const order = await Order.findById(req.params.id);
      if (!order) throw Object.assign(new Error("Order not found"), { statusCode: 404, code: "order_not_found" });
      if (String(order.user) !== String(req.user.userId)) {
        throw Object.assign(new Error("Forbidden"), { statusCode: 403, code: "forbidden" });
      }
      if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
        throw Object.assign(new Error("Cannot cancel after shipped"), { statusCode: 409, code: "cannot_cancel" });
      }
      if (order.orderStatus === "Cancelled") return res.json({ order: order.toObject() });

      for (const it of order.items) {
        // eslint-disable-next-line no-await-in-loop
        await Product.findByIdAndUpdate(it.product, { $inc: { totalSold: -it.quantity } });
      }

      order.orderStatus = "Cancelled";
      order.timeline.push({ status: "Cancelled", date: new Date() });
      await order.save();
      res.json({ order: order.toObject() });
    } catch (err) {
      next(err);
    }
  };
}

function requestReturn() {
  return async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        throw Object.assign(new Error("Invalid order id"), { statusCode: 400, code: "invalid_order_id" });
      }

      const reason = sanitizeText(req.body?.reason);

      const order = await Order.findById(req.params.id);
      if (!order) throw Object.assign(new Error("Order not found"), { statusCode: 404, code: "order_not_found" });
      if (String(order.user) !== String(req.user.userId)) {
        throw Object.assign(new Error("Forbidden"), { statusCode: 403, code: "forbidden" });
      }
      if (order.orderStatus !== "Delivered") {
        throw Object.assign(new Error("Return allowed only after Delivered"), { statusCode: 409, code: "cannot_return" });
      }

      order.returnRequest.status = "Requested";
      order.returnRequest.reason = reason || "—";
      order.timeline.push({ status: "ReturnRequested", date: new Date() });
      await order.save();

      res.json({ order: order.toObject() });
    } catch (err) {
      next(err);
    }
  };
}

function adminListOrders() {
  return async (req, res, next) => {
    try {
      const { skip, limit, page } = parsePagination(req);
      const filter = {};
      if (req.query.status) filter.orderStatus = String(req.query.status);
      const [items, total] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Order.countDocuments(filter),
      ]);
      res.json({ page, limit, total, items });
    } catch (err) {
      next(err);
    }
  };
}

function adminUpdateStatus() {
  return async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        throw Object.assign(new Error("Invalid order id"), { statusCode: 400, code: "invalid_order_id" });
      }
      const nextStatus = sanitizeText(req.body?.status);
      if (!["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"].includes(nextStatus)) {
        throw Object.assign(new Error("Invalid status"), { statusCode: 400, code: "invalid_status" });
      }

      const order = await Order.findById(req.params.id);
      if (!order) throw Object.assign(new Error("Order not found"), { statusCode: 404, code: "order_not_found" });

      if (nextStatus === "Cancelled" || nextStatus === "Returned") {
        throw Object.assign(new Error("Use cancel/return flows"), { statusCode: 409, code: "invalid_transition" });
      }

      if (!assertStatusFlow(order.orderStatus, nextStatus)) {
        throw Object.assign(new Error("Invalid status transition"), { statusCode: 409, code: "invalid_transition" });
      }

      order.orderStatus = nextStatus;
      order.timeline.push({ status: nextStatus, date: new Date() });
      await order.save();
      res.json({ order: order.toObject() });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  createOrder,
  createGuestOrder,
  myOrders,
  getOrder,
  cancelOrder,
  requestReturn,
  adminListOrders,
  adminUpdateStatus,
};

