const express = require("express");
const { requireAdminKey } = require("../../middleware/admin-key.middleware");
const {
  listPublished,
  getBySlug,
  listAdmin,
  createBlog,
  updateBlog,
  publishBlog,
  deleteBlog,
} = require("./blogs.controller");

module.exports = (env) => {
  const router = express.Router();

  router.get("/", listPublished());
  router.get("/admin/all", requireAdminKey(env), listAdmin());
  router.get("/:slug", getBySlug());
  router.post("/", requireAdminKey(env), createBlog());
  router.put("/:id", requireAdminKey(env), updateBlog());
  router.patch("/:id/publish", requireAdminKey(env), publishBlog());
  router.delete("/:id", requireAdminKey(env), deleteBlog());

  return router;
};
