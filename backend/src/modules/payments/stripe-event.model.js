const mongoose = require("mongoose");

const StripeEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    processedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false },
);

const StripeEvent = mongoose.model("StripeEvent", StripeEventSchema);

module.exports = { StripeEvent };
