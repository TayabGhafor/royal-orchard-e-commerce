const Stripe = require("stripe");

const SUCCESS_URL =
  "https://royalorchard.vercel.app/payment/success?session_id={CHECKOUT_SESSION_ID}";
const CANCEL_URL = "https://royalorchard.vercel.app/payment/cancel";

function createStripeClient(secretKey) {
  return new Stripe(secretKey);
}

function toAbsoluteImageUrl(image, env) {
  const raw = String(image || "").trim();
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = String(env.API_PUBLIC_URL || "").replace(/\/+$/, "");
  if (!base) return undefined;
  return raw.startsWith("/") ? `${base}${raw}` : `${base}/${raw}`;
}

function toMinorUnits(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function buildLineItems(order, items, env) {
  const source = Array.isArray(items) && items.length > 0 ? items : order.items || [];
  const lineItems = source.map((item) => {
    const title = String(item.title || item.name || "Royal Orchard item").trim();
    const quantity = Math.max(1, Number(item.quantity || 1));
    const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
    const image = toAbsoluteImageUrl(item.image, env);
    const productData = { name: title };
    if (image) productData.images = [image];

    return {
      quantity,
      price_data: {
        currency: "pkr",
        unit_amount: toMinorUnits(unitPrice),
        product_data: productData,
      },
    };
  });

  const pricing = order.pricing || {};
  const shipping = Number(pricing.shipping || 0);
  const tax = Number(pricing.tax || 0);

  if (shipping > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "pkr",
        unit_amount: toMinorUnits(shipping),
        product_data: { name: "Shipping" },
      },
    });
  }

  if (tax > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "pkr",
        unit_amount: toMinorUnits(tax),
        product_data: { name: "Tax" },
      },
    });
  }

  return lineItems;
}

async function createCheckoutSession({ stripe, order, items, customerEmail, userId, env }) {
  const lineItems = buildLineItems(order, items, env);
  if (lineItems.length === 0) {
    throw Object.assign(new Error("Order has no payable line items"), {
      statusCode: 400,
      code: "invalid_items",
    });
  }

  const resolvedUserId = String(userId || order.user || "").trim();
  if (!resolvedUserId) {
    throw Object.assign(new Error("User id required for Stripe checkout"), {
      statusCode: 400,
      code: "invalid_user_id",
    });
  }

  return stripe.checkout.sessions.create({
    mode: "payment",
    currency: "pkr",
    customer_email: customerEmail,
    line_items: lineItems,
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
    client_reference_id: String(order._id),
    metadata: {
      orderId: String(order._id),
      userId: resolvedUserId,
    },
  });
}

module.exports = {
  CANCEL_URL,
  SUCCESS_URL,
  createStripeClient,
  createCheckoutSession,
  toMinorUnits,
};
