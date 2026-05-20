const mongoose = require("mongoose");
const { Product } = require("../products/product.model");
const { Order } = require("../orders/order.model");
const { UserActivity } = require("./user-activity.model");
const { shapeProductForChat, trendingScore } = require("./chat-utils");

async function activityProductIds(ctx, type, limit = 20) {
  const filter = {};
  if (ctx.userId) filter.userId = new mongoose.Types.ObjectId(ctx.userId);
  else if (ctx.guestSessionId) filter.guestSessionId = ctx.guestSessionId;
  else return [];

  const rows = await UserActivity.find({ ...filter, type })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return [...new Set(rows.map((r) => String(r.productId)))];
}

async function loadProductsByIds(ids) {
  if (!ids.length) return [];
  const oids = ids.filter((id) => mongoose.isValidObjectId(id)).map((id) => new mongoose.Types.ObjectId(id));
  if (!oids.length) return [];
  const docs = await Product.find({ _id: { $in: oids }, isActive: true }).lean();
  const map = new Map(docs.map((d) => [String(d._id), d]));
  return ids.map((id) => map.get(id)).filter(Boolean);
}

async function trendingProducts(limit = 8) {
  const all = await Product.find({ isActive: true }).lean();
  return all
    .sort((a, b) => trendingScore(b) - trendingScore(a))
    .slice(0, limit)
    .map(shapeProductForChat);
}

async function alsoBought(productId, limit = 6) {
  if (!mongoose.isValidObjectId(productId)) return [];
  const oid = new mongoose.Types.ObjectId(productId);
  const orders = await Order.find({
    "items.product": oid,
    orderStatus: { $nin: ["Cancelled", "Returned"] },
  })
    .select("items.product")
    .limit(80)
    .lean();

  const counts = new Map();
  for (const o of orders) {
    const ids = (o.items || []).map((i) => String(i.product));
    if (!ids.includes(String(productId))) continue;
    for (const id of ids) {
      if (id === String(productId)) continue;
      counts.set(id, (counts.get(id) || 0) + 1);
    }
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
  const products = await loadProductsByIds(ranked.slice(0, limit));
  return products.map(shapeProductForChat);
}

async function similarProducts(productId, limit = 6) {
  if (!mongoose.isValidObjectId(productId)) return [];
  const p = await Product.findById(productId).lean();
  if (!p) return [];
  const peers = await Product.find({
    isActive: true,
    _id: { $ne: p._id },
    $or: [{ variety: p.variety }, { collection: p.collection }],
  }).lean();
  return peers.slice(0, limit).map(shapeProductForChat);
}

/**
 * @param {{ userId?: string, guestSessionId?: string }} ctx
 * @param {'forYou'|'similar'|'trending'|'alsoBought'|'recent'} section
 */
async function getRecommendations(ctx, section, { productId, limit = 8 } = {}) {
  switch (section) {
    case "trending":
      return { section, products: await trendingProducts(limit) };

    case "recent": {
      const ids = await activityProductIds(ctx, "view", limit);
      const products = (await loadProductsByIds(ids)).map(shapeProductForChat);
      return { section, products };
    }

    case "forYou": {
      const viewIds = await activityProductIds(ctx, "view", 12);
      const clickIds = await activityProductIds(ctx, "click", 12);
      const seedIds = [...new Set([...clickIds, ...viewIds])];

      if (seedIds.length) {
        const seed = await Product.findById(seedIds[0]).lean();
        if (seed) {
          const peers = await Product.find({
            isActive: true,
            _id: { $nin: seedIds.map((id) => new mongoose.Types.ObjectId(id)) },
            variety: seed.variety,
          })
            .limit(limit)
            .lean();
          if (peers.length) return { section, products: peers.map(shapeProductForChat) };
        }
      }

      if (ctx.userId) {
        const lastOrder = await Order.findOne({ user: ctx.userId })
          .sort({ createdAt: -1 })
          .select("items.product")
          .lean();
        const lastPid = lastOrder?.items?.[0]?.product;
        if (lastPid) {
          const also = await alsoBought(String(lastPid), limit);
          if (also.length) return { section, products: also };
        }
      }

      return { section, products: await trendingProducts(limit) };
    }

    case "similar":
      return { section, products: await similarProducts(productId, limit) };

    case "alsoBought":
      return { section, products: await alsoBought(productId, limit) };

    default:
      return { section, products: await trendingProducts(limit) };
  }
}

module.exports = { getRecommendations, trendingProducts, alsoBought, similarProducts };
