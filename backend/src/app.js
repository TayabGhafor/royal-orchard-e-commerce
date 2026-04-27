const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const { errorMiddleware } = require("./middleware/error.middleware");

function stripMongoOperators(value) {
  if (Array.isArray(value)) return value.map(stripMongoOperators);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("$") || k.includes(".")) continue;
      out[k] = stripMongoOperators(v);
    }
    return out;
  }
  return value;
}

function createApp(env) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(compression());
  app.use(hpp());
  // Express 5 exposes req.query as a getter; do NOT try to mutate it.
  // We still protect write surfaces by stripping Mongo operators from body + params.
  app.use((req, _res, next) => {
    if (req.body) req.body = stripMongoOperators(req.body);
    if (req.params) req.params = stripMongoOperators(req.params);
    next();
  });

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (env.CORS_ORIGINS.length === 0) return cb(null, true);
        if (env.CORS_ORIGINS.includes(origin)) return cb(null, true);
        return cb(new Error("CORS origin not allowed"), false);
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: { code: "rate_limited", message: "Too many requests" } },
    }),
  );

  app.get("/", (_req, res) =>
    res.json({
      name: "RoyalOrchard Backend",
      ok: true,
      health: "/health",
      apiBase: "/api",
    }),
  );
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Routes (mounted by modules)
  app.use("/api/auth", require("./modules/auth/auth.routes")(env));
  app.use("/api/users", require("./modules/users/users.routes")(env));
  app.use("/api/products", require("./modules/products/products.routes")(env));
  app.use("/api/orders", require("./modules/orders/orders.routes")(env));
  app.use("/api/analytics", require("./modules/analytics/analytics.routes")(env));

  app.use((_req, res) => res.status(404).json({ error: { code: "not_found", message: "Route not found" } }));
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };

