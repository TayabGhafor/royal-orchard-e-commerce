const express = require("express");
const { requireAdminKey } = require("../../middleware/admin-key.middleware");
const { createProductImageUpload, wrapUpload } = require("./upload.middleware");
const { postProductImage, streamProductImage } = require("./upload.controller");

module.exports = function uploadRoutesFactory(env) {
  const router = express.Router();
  const upload = createProductImageUpload();

  const uploadHandlers = [requireAdminKey(env), wrapUpload(upload.single("image")), postProductImage];
  router.post("/image", ...uploadHandlers);
  router.post("/image/", ...uploadHandlers);

  router.get("/image/:id", streamProductImage);

  return router;
};
