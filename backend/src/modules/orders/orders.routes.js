const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/role.middleware");

const {
  createOrder,
  myOrders,
  getOrder,
  cancelOrder,
  requestReturn,
  adminListOrders,
  adminUpdateStatus,
} = require("./orders.controller");

module.exports = (env) => {
  const router = express.Router();

  // Customer
  router.post("/", authMiddleware(env), createOrder());
  router.get("/my-orders", authMiddleware(env), myOrders());
  router.get("/:id", authMiddleware(env), getOrder());
  router.put("/:id/cancel", authMiddleware(env), cancelOrder());
  router.post("/:id/return", authMiddleware(env), requestReturn());

  // Admin
  router.get("/", authMiddleware(env), requireAdmin, adminListOrders());
  router.put("/:id/status", authMiddleware(env), requireAdmin, adminUpdateStatus());

  return router;
};

