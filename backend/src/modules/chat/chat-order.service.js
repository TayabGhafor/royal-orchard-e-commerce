const mongoose = require("mongoose");
const { Order } = require("../orders/order.model");
const { formatPk } = require("./chat-utils");

const TIMELINE_STEPS = [
  { key: "Placed", label: "Order placed" },
  { key: "Processing", label: "Processing" },
  { key: "Packed", label: "Packed" },
  { key: "Shipped", label: "Shipped" },
  { key: "OutForDelivery", label: "Out for delivery" },
  { key: "Delivered", label: "Delivered" },
];

function mapStatusToStep(status) {
  const s = String(status || "Placed");
  if (s === "Delivered") return "Delivered";
  if (s === "Shipped") return "Shipped";
  if (s === "Processing") return "Processing";
  if (s === "Cancelled" || s === "Returned") return s;
  return "Placed";
}

function buildTimeline(orderStatus) {
  const current = mapStatusToStep(orderStatus);
  const order = ["Placed", "Processing", "Packed", "Shipped", "OutForDelivery", "Delivered"];
  const idx = order.indexOf(current === "Placed" ? "Placed" : current);
  const effectiveIdx = idx < 0 ? 0 : idx;

  return TIMELINE_STEPS.map((step, i) => {
    const stepIdx = order.indexOf(step.key === "Packed" ? "Processing" : step.key);
    const compareIdx =
      step.key === "Packed"
        ? order.indexOf("Processing")
        : step.key === "OutForDelivery"
          ? order.indexOf("Shipped")
          : order.indexOf(step.key);
    let state = "pending";
    if (orderStatus === "Delivered" && step.key === "Delivered") state = "complete";
    else if (orderStatus === "Shipped" && ["Placed", "Processing", "Packed", "Shipped"].includes(step.key))
      state = "complete";
    else if (orderStatus === "Processing" && ["Placed", "Processing", "Packed"].includes(step.key))
      state = "complete";
    else if (compareIdx <= effectiveIdx) state = "complete";
    else if (compareIdx === effectiveIdx + 1) state = "active";
    return { ...step, state };
  });
}

function expectedDeliveryDate(createdAt, status) {
  const base = new Date(createdAt || Date.now());
  const days = status === "Delivered" ? 0 : status === "Shipped" ? 2 : 4;
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function getOrderStatusForUser(userId, { orderId } = {}) {
  if (!userId) {
    return { error: "Please sign in to track orders at /orders." };
  }

  const filter = { user: new mongoose.Types.ObjectId(userId) };
  let order;
  if (orderId && mongoose.isValidObjectId(orderId)) {
    order = await Order.findOne({ ...filter, _id: orderId }).lean();
  } else {
    order = await Order.findOne(filter).sort({ createdAt: -1 }).lean();
  }

  if (!order) return { error: "No orders found yet. Place an order from /shop." };

  const timeline = buildTimeline(order.orderStatus);
  const reply = [
    `Order ${String(order._id).slice(-8).toUpperCase()}`,
    `Status: ${order.orderStatus}`,
    `Total: ${formatPk(order.pricing?.total)}`,
    `Expected delivery: ${expectedDeliveryDate(order.createdAt, order.orderStatus)}`,
    `Track full details at /orders`,
  ].join("\n");

  return {
    orderId: String(order._id),
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    total: order.pricing?.total,
    expectedDelivery: expectedDeliveryDate(order.createdAt, order.orderStatus),
    timeline,
    reply,
  };
}

function isOrderTrackingQuery(q) {
  return /\b(where is my order|order status|track(ing)?\s*(my)?\s*order|my order|delivery status)\b/i.test(
    String(q || ""),
  );
}

module.exports = {
  getOrderStatusForUser,
  isOrderTrackingQuery,
  buildTimeline,
  TIMELINE_STEPS,
};
