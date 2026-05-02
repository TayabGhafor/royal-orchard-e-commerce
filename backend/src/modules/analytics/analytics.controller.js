const { Order } = require("../orders/order.model");
const { Product } = require("../products/product.model");
const { User } = require("../users/user.model");

function dashboard() {
  return async (_req, res, next) => {
    try {
      const [totalOrders, revenueAgg, activeUsers, topProducts] = await Promise.all([
        Order.countDocuments({}),
        Order.aggregate([{ $group: { _id: null, revenue: { $sum: "$pricing.total" } } }]),
        User.countDocuments({}),
        Product.find({}).sort({ totalSold: -1 }).limit(5).lean(),
      ]);

      const totalRevenue = revenueAgg?.[0]?.revenue || 0;

      // weekly revenue (last 7 days)
      const now = new Date();
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      const weekly = await Order.aggregate([
        { $match: { createdAt: { $gte: start } } },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
              d: { $dayOfMonth: "$createdAt" },
            },
            revenue: { $sum: "$pricing.total" },
          },
        },
        { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
      ]);

      res.json({
        totalOrders,
        totalRevenue,
        activeUsers,
        topSellingProducts: topProducts.map((p) => ({
          id: p._id,
          title: p.name,
          totalSold: p.totalSold,
          availabilityStatus: p.availabilityStatus,
        })),
        weeklyRevenueTrends: weekly.map((row) => ({
          date: `${row._id.y}-${String(row._id.m).padStart(2, "0")}-${String(row._id.d).padStart(2, "0")}`,
          revenue: row.revenue,
        })),
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { dashboard };

