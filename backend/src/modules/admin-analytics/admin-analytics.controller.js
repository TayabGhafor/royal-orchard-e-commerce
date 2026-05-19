const {
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
} = require("./admin-analytics.service");

function wrap(fn) {
  return async (_req, res, next) => {
    try {
      const data = await fn();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  sales: () => wrap(salesBundle),
  dashboard: () => wrap(dashboardOverview),
  trending: () => wrap(trendingProducts),
  upcomingTrending: () => wrap(upcomingTrending),
  returns: () => wrap(returnsAnalytics),
  inventory: () => wrap(inventoryAnalytics),
  seasonal: () => wrap(seasonalAnalytics),
  recommendations: () => wrap(recommendations),
  hits: () => wrap(hitsAnalytics),
  insights: () => wrap(businessInsights),
};
