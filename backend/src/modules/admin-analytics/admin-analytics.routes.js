const express = require("express");
const { requireAdminKey } = require("../../middleware/admin-key.middleware");
const ctrl = require("./admin-analytics.controller");

module.exports = (env) => {
  const router = express.Router();
  const adminKey = requireAdminKey(env);

  router.get("/dashboard", adminKey, ctrl.dashboard());
  router.get("/sales", adminKey, ctrl.sales());
  router.get("/trending", adminKey, ctrl.trending());
  router.get("/upcoming-trending", adminKey, ctrl.upcomingTrending());
  router.get("/returns", adminKey, ctrl.returns());
  router.get("/inventory", adminKey, ctrl.inventory());
  router.get("/seasonal", adminKey, ctrl.seasonal());
  router.get("/recommendations", adminKey, ctrl.recommendations());
  router.get("/hits", adminKey, ctrl.hits());
  router.get("/insights", adminKey, ctrl.insights());

  return router;
};
