const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { requireAdmin } = require("../../middleware/role.middleware");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./products.controller");

module.exports = (env) => {
  const router = express.Router();

  router.get("/", listProducts());
  router.get("/:id", getProduct());

  router.post("/", authMiddleware(env), requireAdmin, createProduct());
  router.put("/:id", authMiddleware(env), requireAdmin, updateProduct());
  router.delete("/:id", authMiddleware(env), requireAdmin, deleteProduct());

  return router;
};

