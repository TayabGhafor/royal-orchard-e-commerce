const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    title: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const TimelineSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false, index: true },
    guest: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    items: { type: [OrderItemSchema], default: [] },
    deliveryDetails: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },
    paymentMethod: { type: String, enum: ["COD", "Easypaisa", "JazzCash", "Card"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Unpaid"], default: "Pending" },
    paymentGateway: { type: String, enum: ["Stripe", "Manual", "COD"] },
    stripeSessionId: { type: String, trim: true, default: null },
    transactionId: { type: String, trim: true, default: null },
    orderStatus: {
      type: String,
      enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Placed",
      index: true,
    },
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      shipping: { type: Number, required: true, min: 0 },
      tax: { type: Number, required: true, min: 0 },
      total: { type: Number, required: true, min: 0 },
    },
    timeline: { type: [TimelineSchema], default: [] },
    returnRequest: {
      status: { type: String, enum: ["None", "Requested", "Approved", "Rejected"], default: "None" },
      reason: { type: String, trim: true },
    },
    /** Set when an order is marked returned (admin or automated flow). */
    returned: { type: Boolean, default: false, index: true },
    returnReason: { type: String, enum: ["damaged", "wrong_item", "quality_issue", "other"] },
    deliveredDate: { type: Date, default: null },
  },
  { timestamps: true },
);

OrderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", OrderSchema);

module.exports = { Order };

