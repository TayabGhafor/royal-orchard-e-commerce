const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");

const { register, login, me } = require("./auth.controller");

module.exports = (env) => {
  const router = express.Router();

  router.post("/register", register(env));
  router.post("/login", login(env));
  router.get("/me", authMiddleware(env), me());

  return router;
};

