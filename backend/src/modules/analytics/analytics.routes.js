const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/role.middleware");
const { dashboard } = require("./analytics.controller");

module.exports = (env) => {
  const router = express.Router();

  router.get("/dashboard", authMiddleware(env), requireAdmin, dashboard());

  return router;
};

