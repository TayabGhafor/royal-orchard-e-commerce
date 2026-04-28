const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { requireAdminKey } = require("../../middleware/admin-key.middleware");

const {
  createOrder,
  createGuestOrder,
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
  router.post("/guest", createGuestOrder());
  router.post("/", authMiddleware(env), createOrder());
  router.get("/my-orders", authMiddleware(env), myOrders());
  router.get("/:id", authMiddleware(env), getOrder());
  router.put("/:id/cancel", authMiddleware(env), cancelOrder());
  router.post("/:id/return", authMiddleware(env), requestReturn());

  // Admin
  router.get("/", requireAdminKey(env), adminListOrders());
  router.put("/:id/status", requireAdminKey(env), adminUpdateStatus());

  return router;
};

