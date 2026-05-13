const mongoose = require("mongoose");
const validator = require("validator");

const { Order } = require("../orders/order.model");
const { StripeEvent } = require("./stripe-event.model");
const { createStripeClient, createCheckoutSession } = require("./stripe.service");

function assertStripeConfigured(env) {
  if (!env.STRIPE_SECRET_KEY) {
    throw Object.assign(new Error("Stripe is not configured"), {
      statusCode: 503,
      code: "stripe_not_configured",
    });
  }
}

function normalizeSessionItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => ({
      title: String(item.title || item.name || "").trim(),
      image: String(item.image || "").trim(),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice ?? item.price),
    }))
    .filter((item) => item.title && Number.isInteger(item.quantity) && item.quantity > 0 && Number.isFinite(item.unitPrice));
}

function createStripeSession() {
  return async (req, res, next) => {
    try {
      assertStripeConfigured(req.app.get("envConfig"));
      const env = req.app.get("envConfig");
      const body = req.body || {};
      const orderId = String(body.orderId || "").trim();
      const customerEmail = validator.normalizeEmail(String(body.customerEmail || "").trim()) || "";
      const items = normalizeSessionItems(body.items);

      if (!mongoose.isValidObjectId(orderId)) {
        throw Object.assign(new Error("Invalid order id"), { statusCode: 400, code: "invalid_order_id" });
      }
      if (!customerEmail) {
        throw Object.assign(new Error("Customer email required"), { statusCode: 400, code: "invalid_email" });
      }
      if (items.length === 0) {
        throw Object.assign(new Error("Order items required"), { statusCode: 400, code: "invalid_items" });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        throw Object.assign(new Error("Order not found"), { statusCode: 404, code: "order_not_found" });
      }
      if (String(order.user) !== String(req.user.userId)) {
        throw Object.assign(new Error("Forbidden"), { statusCode: 403, code: "forbidden" });
      }
      if (order.paymentMethod !== "Card") {
        throw Object.assign(new Error("Order is not a card payment"), {
          statusCode: 409,
          code: "invalid_payment_method",
        });
      }
      if (order.paymentStatus === "Paid") {
        throw Object.assign(new Error("Order is already paid"), { statusCode: 409, code: "already_paid" });
      }

      const stripe = createStripeClient(env.STRIPE_SECRET_KEY);
      const session = await createCheckoutSession({
        stripe,
        order,
        items,
        customerEmail,
        userId: req.user.userId,
        env,
      });

      order.paymentGateway = "Stripe";
      order.stripeSessionId = session.id;
      await order.save();

      res.json({ checkoutUrl: session.url });
    } catch (err) {
      next(err);
    }
  };
}

function stripeWebhook(env) {
  return async (req, res, next) => {
    try {
      assertStripeConfigured(env);
      const stripe = createStripeClient(env.STRIPE_SECRET_KEY);
      const signature = req.headers["stripe-signature"];
      let event;

      if (env.STRIPE_WEBHOOK_SECRET) {
        if (!signature) {
          throw Object.assign(new Error("Missing Stripe signature"), {
            statusCode: 400,
            code: "missing_signature",
          });
        }
        event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
      } else {
        event = JSON.parse(req.body.toString("utf8"));
      }

      const existingEvent = await StripeEvent.findOne({ eventId: event.id });
      if (existingEvent) {
        // eslint-disable-next-line no-console
        console.log("[stripe webhook] duplicate event ignored", { eventId: event.id });
        return res.json({ received: true });
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = String(session.metadata?.orderId || session.client_reference_id || "");
        if (mongoose.isValidObjectId(orderId)) {
          const order = await Order.findById(orderId);
          if (order) {
            order.paymentStatus = "Paid";
            order.paymentGateway = "Stripe";
            order.stripeSessionId = session.id;
            order.transactionId = String(session.payment_intent || session.id);
            await order.save();
          }
        }
      }

      await StripeEvent.create({
        eventId: event.id,
        eventType: event.type,
        processedAt: new Date(),
      });

      res.json({ received: true });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  createStripeSession,
  stripeWebhook,
};
