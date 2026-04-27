const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { getProfile, updateProfile } = require("./users.controller");

module.exports = (env) => {
  const router = express.Router();

  router.get("/profile", authMiddleware(env), getProfile());
  router.put("/update", authMiddleware(env), updateProfile());

  return router;
};

