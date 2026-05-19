const { Order } = require("../orders/order.model");
const { Product } = require("../products/product.model");
const { ProductDailyStat } = require("../analytics/product-daily-stat.model");

function utcMidnight(d) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function effectiveInventory(p) {
  if (p == null) return 0;
  if (Number.isFinite(Number(p.inventoryStock))) return Math.max(0, Number(p.inventoryStock));
  if (Number.isFinite(Number(p.stock))) return Math.max(0, Number(p.stock));
  return p.availabilityStatus === "Out of Stock" ? 0 : 0;
}

function primaryImageUrl(images) {
  const first = Array.isArray(images) && images.length ? images[0] : null;
  if (!first) return "";
  if (typeof first === "string") return first;
  return first.url || "";
}

function trendingScore(p) {
  const views = Number(p.viewsCount || 0);
  const carts = Number(p.cartCount || 0);
  const sold = Number(p.totalSold || 0);
  return views * 0.3 + sold * 0.5 + carts * 0.2;
}

async function salesBundle() {
  const now = new Date();
  const todayStart = utcMidnight(now);
  const weekStart = new Date(todayStart);
  weekStart.setUTCDate(weekStart.getUTCDate() - 6);
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const nonCancelled = { orderStatus: { $ne: "Cancelled" } };
  const delivered = { orderStatus: "Delivered" };
  const returned = { orderStatus: "Returned" };
  const pending = { orderStatus: { $in: ["Placed", "Processing", "Shipped"] } };

  const [
    totalAgg,
    todayAgg,
    weekAgg,
    monthAgg,
    revenueAgg,
    ordersCount,
    returnedCount,
    pendingCount,
    dailyTrend,
    monthlyTrend,
    statusAgg,
  ] = await Promise.all([
    Order.aggregate([{ $match: nonCancelled }, { $group: { _id: null, sum: { $sum: "$pricing.total" } } }]),
    Order.aggregate([{ $match: { ...nonCancelled, createdAt: { $gte: todayStart } } }, { $group: { _id: null, sum: { $sum: "$pricing.total" } } }]),
    Order.aggregate([{ $match: { ...nonCancelled, createdAt: { $gte: weekStart } } }, { $group: { _id: null, sum: { $sum: "$pricing.total" } } }]),
    Order.aggregate([{ $match: { ...nonCancelled, createdAt: { $gte: monthStart } } }, { $group: { _id: null, sum: { $sum: "$pricing.total" } } }]),
    Order.aggregate([{ $match: delivered }, { $group: { _id: null, sum: { $sum: "$pricing.total" } } }]),
    Order.countDocuments({}),
    Order.countDocuments(returned),
    Order.countDocuments(pending),
    Order.aggregate([
      { $match: { ...nonCancelled, createdAt: { $gte: new Date(todayStart.getTime() - 29 * 86400000) } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          amount: { $sum: "$pricing.total" },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]),
    Order.aggregate([
      { $match: { ...nonCancelled, createdAt: { $gte: new Date(Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), 1)) } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          amount: { $sum: "$pricing.total" },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
    ]),
    Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const totalSales = totalAgg[0]?.sum || 0;
  const mapStatus = Object.fromEntries(statusAgg.map((r) => [r._id, r.count]));
  const deliveredN = mapStatus.Delivered || 0;
  const placedN = (mapStatus.Placed || 0) + (mapStatus.Processing || 0) + (mapStatus.Shipped || 0);
  const cancelledN = mapStatus.Cancelled || 0;
  const returnedN = mapStatus.Returned || 0;

  const orderStatusDistribution = [
    { name: "Delivered", value: deliveredN },
    { name: "Pending", value: placedN },
    { name: "Cancelled", value: cancelledN },
    { name: "Returned", value: returnedN },
  ];

  return {
    totalSales,
    todaySales: todayAgg[0]?.sum || 0,
    weeklySales: weekAgg[0]?.sum || 0,
    monthlySales: monthAgg[0]?.sum || 0,
    revenue: revenueAgg[0]?.sum || 0,
    orders: ordersCount,
    returnedOrders: returnedCount,
    pendingOrders: pendingCount,
    dailySalesTrend: dailyTrend.map((r) => ({
      day: `${r._id.y}-${String(r._id.m).padStart(2, "0")}-${String(r._id.d).padStart(2, "0")}`,
      amount: r.amount,
    })),
    monthlyRevenueTrend: monthlyTrend.map((r) => ({
      month: `${r._id.y}-${String(r._id.m).padStart(2, "0")}`,
      amount: r.amount,
    })),
    orderStatusDistribution,
  };
}

async function trendingProducts() {
  const rows = await Product.find({ isActive: true }).lean();
  const scored = rows
    .map((p) => {
      const score = trendingScore(p);
      return {
        productId: String(p._id),
        name: p.name,
        slug: p.slug,
        image: primaryImageUrl(p.images),
        salesCount: p.totalSold || 0,
        viewsCount: p.viewsCount || 0,
        trendingScore: Math.round(score * 10) / 10,
        scoreRaw: score,
      };
    })
    .sort((a, b) => b.scoreRaw - a.scoreRaw)
    .slice(0, 10);

  const maxScore = scored[0]?.scoreRaw || 1;
  return {
    items: scored.map(({ scoreRaw, ...rest }) => ({
      ...rest,
      progress: Math.min(100, Math.round((scoreRaw / maxScore) * 100)),
    })),
  };
}

async function upcomingTrending() {
  const t0 = utcMidnight(new Date());
  const recentStart = new Date(t0);
  recentStart.setUTCDate(recentStart.getUTCDate() - 7);
  const prevStart = new Date(t0);
  prevStart.setUTCDate(prevStart.getUTCDate() - 14);
  const prevEnd = recentStart;

  const stats = await ProductDailyStat.aggregate([
    {
      $match: {
        day: { $gte: prevStart },
      },
    },
    {
      $group: {
        _id: "$product",
        recentViews: { $sum: { $cond: [{ $gte: ["$day", recentStart] }, "$views", 0] } },
        prevViews: {
          $sum: {
            $cond: [{ $and: [{ $gte: ["$day", prevStart] }, { $lt: ["$day", prevEnd] }] }, "$views", 0],
          },
        },
        recentCarts: { $sum: { $cond: [{ $gte: ["$day", recentStart] }, "$cartAdds", 0] } },
        prevCarts: {
          $sum: {
            $cond: [{ $and: [{ $gte: ["$day", prevStart] }, { $lt: ["$day", prevEnd] }] }, "$cartAdds", 0],
          },
        },
      },
    },
  ]);

  const products = await Product.find({ _id: { $in: stats.map((s) => s._id) } })
    .select("name slug images viewsCount cartCount totalSold")
    .lean();
  const pmap = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const row of stats) {
    const p = pmap.get(String(row._id));
    if (!p) continue;
    const pv = Math.max(1, row.prevViews);
    const pc = Math.max(1, row.prevCarts);
    const vGrowth = ((row.recentViews - row.prevViews) / pv) * 100;
    const cGrowth = ((row.recentCarts - row.prevCarts) / pc) * 100;
    if (vGrowth < 20) continue;
    if (row.recentCarts <= row.prevCarts && row.recentCarts < 2) continue;

    let badge = "Low";
    if (vGrowth >= 45 && row.recentCarts >= 3) badge = "High";
    else if (vGrowth >= 30 || row.recentCarts >= 2) badge = "Medium";

    let demand = "Medium";
    if (badge === "High") demand = "High";
    if (badge === "Low") demand = "Low";

    items.push({
      productId: String(p._id),
      name: p.name,
      slug: p.slug,
      image: primaryImageUrl(p.images),
      growthPercent: Math.round(vGrowth * 10) / 10,
      cartMomentum: Math.round(cGrowth * 10) / 10,
      badge,
      expectedDemand: demand,
      label: "Potential Trending",
    });
  }

  items.sort((a, b) => b.growthPercent - a.growthPercent);
  return { items: items.slice(0, 12) };
}

async function returnsAnalytics() {
  const [totalOrders, returnedOrders, reasonAgg, topReturned] = await Promise.all([
    Order.countDocuments({}),
    Order.countDocuments({ orderStatus: "Returned" }),
    Order.aggregate([
      { $match: { orderStatus: "Returned" } },
      {
        $group: {
          _id: { $ifNull: ["$returnReason", "other"] },
          count: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      { $match: { orderStatus: "Returned" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          qty: { $sum: "$items.quantity" },
        },
      },
      { $sort: { qty: -1 } },
      { $limit: 8 },
    ]),
  ]);

  const reasonMap = { damaged: 0, wrong_item: 0, quality_issue: 0, other: 0 };
  // eslint-disable-next-line no-restricted-syntax
  for (const r of reasonAgg) {
    const k = r._id && reasonMap[r._id] !== undefined ? r._id : "other";
    reasonMap[k] = (reasonMap[k] || 0) + r.count;
  }

  const ids = topReturned.map((t) => t._id).filter(Boolean);
  const prods = await Product.find({ _id: { $in: ids } }).select("name images").lean();
  const nameById = new Map(prods.map((p) => [String(p._id), p]));

  return {
    totalReturns: returnedOrders,
    returnRate: totalOrders ? Math.round((returnedOrders / totalOrders) * 1000) / 10 : 0,
    reasons: reasonMap,
    mostReturned: topReturned.map((t) => {
      const pr = nameById.get(String(t._id));
      return {
        productId: String(t._id),
        name: pr?.name || "Product",
        image: primaryImageUrl(pr?.images),
        quantityReturned: t.qty,
      };
    }),
  };
}

async function unitsSoldLast30DaysByProduct() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);
  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: since }, orderStatus: { $nin: ["Cancelled", "Returned"] } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        units: { $sum: "$items.quantity" },
      },
    },
  ]);
  return new Map(rows.map((r) => [String(r._id), r.units]));
}

async function inventoryAnalytics() {
  const products = await Product.find({ isActive: true }).select("name slug images inventoryStock stock availabilityStatus totalSold").lean();
  const velocity = await unitsSoldLast30DaysByProduct();

  const out = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const p of products) {
    const qty = effectiveInventory(p);
    const sold30 = velocity.get(String(p._id)) || 0;
    const daily = sold30 / 30;
    const daysRemaining = daily > 0.05 ? Math.round(qty / daily) : qty > 0 ? null : 0;

    let band = "ok";
    if (qty === 0) band = "out";
    else if (qty < 5) band = "critical";
    else if (qty < 10) band = "low";

    out.push({
      productId: String(p._id),
      name: p.name,
      slug: p.slug,
      image: primaryImageUrl(p.images),
      quantity: qty,
      daysRemainingEstimate: daysRemaining,
      band,
    });
  }

  out.sort((a, b) => a.quantity - b.quantity);
  return {
    outOfStock: out.filter((x) => x.band === "out"),
    lowStock: out.filter((x) => x.band === "low"),
    criticalStock: out.filter((x) => x.band === "critical"),
    all: out,
  };
}

async function seasonalAnalytics() {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 30);
  const products = await Product.find({ isActive: true }).select("season inventoryStock totalSold name").lean();

  const salesByProduct = await Order.aggregate([
    { $match: { createdAt: { $gte: since }, orderStatus: { $nin: ["Cancelled", "Returned"] } } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
  ]);
  const revMap = new Map(salesByProduct.map((s) => [String(s._id), s.revenue]));

  const seasons = ["Summer", "Winter", "Spring", "Autumn"];
  const rows = seasons.map((season) => {
    const subset = products.filter((p) => (p.season || "Summer") === season);
    const stock = subset.reduce((s, p) => s + effectiveInventory(p), 0);
    const salesTrend = subset.reduce((s, p) => s + (revMap.get(String(p._id)) || 0), 0);
    return {
      season,
      productCount: subset.length,
      stockQuantity: stock,
      salesTrend30d: Math.round(salesTrend),
      products: subset.slice(0, 6).map((p) => ({
        name: p.name,
        stock: effectiveInventory(p),
        sold: p.totalSold || 0,
      })),
    };
  });

  return {
    seasons: rows,
    seasonVsSales: rows.map((r) => ({ season: r.season, sales: r.salesTrend30d, stock: r.stockQuantity })),
  };
}

async function recommendations() {
  const products = await Product.find({ isActive: true }).lean();
  const velocity = await unitsSoldLast30DaysByProduct();
  const cards = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const p of products) {
    const inv = effectiveInventory(p);
    const sold30 = velocity.get(String(p._id)) || 0;
    const daily = sold30 / 30;
    const daysLeft = daily > 0.05 ? inv / daily : null;

    if (daysLeft != null && daysLeft < 14 && inv > 0) {
      cards.push({
        priority: daysLeft < 7 ? "High" : "Medium",
        title: `${p.name} stock runway`,
        detail: `${p.name} stock may run out within ${Math.max(1, Math.round(daysLeft))} days at current velocity.`,
        productId: String(p._id),
      });
    }

    const nextSeason = p.season || "Summer";
    const growth = sold30 > 0 ? Math.min(80, 15 + (sold30 / Math.max(1, inv)) * 20) : 10;
    if (sold30 >= 5 && inv < 80) {
      const bump = Math.max(20, Math.round(sold30 * 1.2));
      cards.push({
        priority: sold30 > inv * 0.3 ? "High" : "Low",
        title: `${nextSeason} demand outlook`,
        detail: `${p.name} demand expected to stay strong next cycle. Consider increasing inventory by ~${bump} units.`,
        productId: String(p._id),
      });
    }
  }

  const uniq = [];
  const seen = new Set();
  // eslint-disable-next-line no-restricted-syntax
  for (const c of cards) {
    const k = `${c.title}|${c.productId}`;
    if (seen.has(k)) continue;
    seen.add(k);
    uniq.push(c);
    if (uniq.length >= 12) break;
  }

  return { items: uniq };
}

async function hitsAnalytics() {
  const rows = await Product.find({ isActive: true }).sort({ viewsCount: -1 }).limit(15).lean();
  const items = rows.map((p) => {
    const views = p.viewsCount || 0;
    const sales = p.totalSold || 0;
    const conv = views > 0 ? Math.round((sales / views) * 1000) / 10 : 0;
    return {
      productId: String(p._id),
      name: p.name,
      slug: p.slug,
      image: primaryImageUrl(p.images),
      views,
      sales,
      conversionPercent: conv,
    };
  });
  return {
    items,
    chart: items.slice(0, 10).map((i) => ({ name: i.name.slice(0, 18), hits: i.views })),
  };
}

async function businessInsights() {
  const now = new Date();
  const thisWeekStart = utcMidnight(now);
  thisWeekStart.setUTCDate(thisWeekStart.getUTCDate() - 6);
  const prevWeekStart = new Date(thisWeekStart);
  prevWeekStart.setUTCDate(prevWeekStart.getUTCDate() - 7);
  const prevWeekEnd = new Date(thisWeekStart);

  const [thisWeek, prevWeek, topVariety, retNow, retPrev] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: thisWeekStart }, orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, revenue: { $sum: "$pricing.total" }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: prevWeekStart, $lt: prevWeekEnd },
          orderStatus: { $ne: "Cancelled" },
        },
      },
      { $group: { _id: null, revenue: { $sum: "$pricing.total" }, count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { orderStatus: { $nin: ["Cancelled", "Returned"] } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "p",
        },
      },
      { $unwind: "$p" },
      { $group: { _id: "$p.variety", units: { $sum: "$items.quantity" } } },
      { $sort: { units: -1 } },
      { $limit: 1 },
    ]),
    Order.countDocuments({ createdAt: { $gte: thisWeekStart }, orderStatus: "Returned" }),
    Order.countDocuments({
      createdAt: { $gte: prevWeekStart, $lt: prevWeekEnd },
      orderStatus: "Returned",
    }),
  ]);

  const tw = thisWeek[0] || { revenue: 0, count: 0 };
  const pw = prevWeek[0] || { revenue: 0, count: 0 };
  const revDelta = pw.revenue > 0 ? Math.round(((tw.revenue - pw.revenue) / pw.revenue) * 1000) / 10 : tw.revenue > 0 ? 100 : 0;
  const topV = topVariety[0]?._id || "Chaunsa";

  const insights = [];
  if (tw.count > 0 || pw.count > 0) {
    insights.push({
      id: "sales-week",
      title: "Weekly sales momentum",
      detail: `Sales ${revDelta >= 0 ? "increased" : "decreased"} by ${Math.abs(revDelta)}% this week vs last week.`,
      tone: revDelta >= 0 ? "positive" : "neutral",
    });
  }
  insights.push({
    id: "top-variety",
    title: "Customer favorite",
    detail: `Most purchased variety recently: ${topV}.`,
    tone: "positive",
  });
  const retDelta =
    retPrev > 0 ? Math.round(((retNow - retPrev) / retPrev) * 1000) / 10 : retNow > 0 ? 100 : 0;
  insights.push({
    id: "returns",
    title: "Return activity",
    detail:
      retPrev > 0 || retNow > 0
        ? `Return orders this week: ${retNow}. ${retDelta <= 0 ? "Return volume improved vs last week." : "Returns ticked up vs last week — worth a quick QA pass."}`
        : "No returns recorded in the last two windows.",
    tone: retDelta <= 0 ? "positive" : "warning",
  });

  const summer = await Product.countDocuments({ isActive: true, season: "Summer" });
  if (summer > 0) {
    insights.push({
      id: "season",
      title: "Seasonal mix",
      detail: `Summer-tagged SKUs represent a large share of the active catalog (${summer} listings).`,
      tone: "neutral",
    });
  }

  insights.push({
    id: "inventory",
    title: "Inventory posture",
    detail: "Review low-stock and critical alerts to stay ahead of harvest demand.",
    tone: "neutral",
  });

  return { items: insights };
}

async function dashboardOverview() {
  const [sales, trending, upcoming, returns, inventory, seasonal, recommendationsData, hits, insights] =
    await Promise.all([
      salesBundle(),
      trendingProducts(),
      upcomingTrending(),
      returnsAnalytics(),
      inventoryAnalytics(),
      seasonalAnalytics(),
      recommendations(),
      hitsAnalytics(),
      businessInsights(),
    ]);

  return {
    generatedAt: new Date().toISOString(),
    sales,
    trending: trending.items,
    upcomingTrending: upcoming.items,
    returns,
    inventory,
    seasonal,
    recommendations: recommendationsData.items,
    hits: hits.items,
    hitsChart: hits.chart,
    insights: insights.items,
  };
}

module.exports = {
  salesBundle,
  trendingProducts,
  upcomingTrending,
  returnsAnalytics,
  inventoryAnalytics,
  seasonalAnalytics,
  recommendations,
  hitsAnalytics,
  businessInsights,
  dashboardOverview,
};
