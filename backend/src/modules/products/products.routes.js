const express = require("express");
const { requireAdminKey } = require("../../middleware/admin-key.middleware");
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

  router.post("/", requireAdminKey(env), createProduct());
  router.put("/:id", requireAdminKey(env), updateProduct());
  router.delete("/:id", requireAdminKey(env), deleteProduct());

  return router;
};

