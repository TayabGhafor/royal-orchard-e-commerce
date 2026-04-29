const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");

const { register, login, me, forgotPassword, verifyResetCode, resetPassword } = require("./auth.controller");

module.exports = (env) => {
  const router = express.Router();

  router.post("/register", register(env));
  router.post("/login", login(env));
  router.get("/me", authMiddleware(env), me());
  router.post("/forgot-password", forgotPassword(env));
  router.post("/verify-reset-code", verifyResetCode(env));
  router.post("/reset-password", resetPassword(env));

  return router;
};

