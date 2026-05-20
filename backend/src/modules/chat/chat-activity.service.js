const mongoose = require("mongoose");
const { UserActivity } = require("./user-activity.model");

async function recordActivity({ userId, guestSessionId, productId, type }) {
  if (!mongoose.isValidObjectId(productId)) {
    throw Object.assign(new Error("Invalid productId"), { statusCode: 400, code: "invalid_product" });
  }
  if (!["view", "click"].includes(type)) {
    throw Object.assign(new Error("Invalid activity type"), { statusCode: 400, code: "invalid_type" });
  }
  if (!userId && !guestSessionId) {
    throw Object.assign(new Error("userId or guestSessionId required"), {
      statusCode: 400,
      code: "invalid_session",
    });
  }

  await UserActivity.create({
    userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
    guestSessionId: guestSessionId || undefined,
    productId: new mongoose.Types.ObjectId(productId),
    type,
  });

  return { ok: true };
}

module.exports = { recordActivity };
