const express = require("express");
const { requireAdminKey } = require("../../middleware/admin-key.middleware");
const { createProductImageUploader } = require("./upload.config");
const { wrapUpload, postProductImage, streamProductImage } = require("./upload.controller");

module.exports = function uploadRoutesFactory(env) {
  const router = express.Router();
  const multerUploader = createProductImageUploader();

  router.post("/image", requireAdminKey(env), wrapUpload(multerUploader.single("image")), postProductImage);

  router.get("/image/:id", streamProductImage);

  return router;
};
