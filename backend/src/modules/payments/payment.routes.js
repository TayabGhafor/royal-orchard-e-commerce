const express = require("express");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { createStripeSession } = require("./payment.controller");

module.exports = (env) => {
  const router = express.Router();

  router.post("/stripe/create-session", authMiddleware(env), createStripeSession());

  return router;
};
