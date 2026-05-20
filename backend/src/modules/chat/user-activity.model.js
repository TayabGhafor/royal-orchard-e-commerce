const mongoose = require("mongoose");

const UserActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    guestSessionId: { type: String, trim: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    type: { type: String, enum: ["view", "click"], required: true, index: true },
  },
  { timestamps: true },
);

UserActivitySchema.index({ userId: 1, type: 1, createdAt: -1 });
UserActivitySchema.index({ guestSessionId: 1, type: 1, createdAt: -1 });

const UserActivity = mongoose.model("UserActivity", UserActivitySchema);

module.exports = { UserActivity };
