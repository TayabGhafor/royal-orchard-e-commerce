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

/** In development, treat localhost and 127.0.0.1 as the same origin for CORS when one is listed. */
function isOriginAllowed(env, origin) {
  if (!origin) return true;
  if (!env.CORS_ORIGINS || env.CORS_ORIGINS.length === 0) return true;
  if (env.CORS_ORIGINS.includes(origin)) return true;
  if (env.NODE_ENV === "production") return false;
  try {
    const u = new URL(origin);
    return env.CORS_ORIGINS.some((allowed) => {
      try {
        const a = new URL(allowed);
        if (u.protocol !== a.protocol) return false;
        const portU = u.port || (u.protocol === "https:" ? "443" : "80");
        const portA = a.port || (a.protocol === "https:" ? "443" : "80");
        if (portU !== portA) return false;
        if (u.hostname === a.hostname) return true;
        return (
          (u.hostname === "localhost" && a.hostname === "127.0.0.1") ||
          (u.hostname === "127.0.0.1" && a.hostname === "localhost")
        );
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

function redactSensitive(value) {
  if (Array.isArray(value)) return value.map(redactSensitive);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const lower = k.toLowerCase();
      if (["password", "token", "access_token", "refresh_token", "jwt", "secret", "authorization"].includes(lower)) {
        out[k] = "[REDACTED]";
      } else {
        out[k] = redactSensitive(v);
      }
    }
    return out;
  }
  return value;
}

function createApp(env) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.set("envConfig", env);

  /** Allow `<img src="https://api…/api/uploads/image/:id">` from other origins (admin UI). Default CORP is `same-origin`, which blocks cross-site embedding in many browsers. */
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  /**
   * Do not gzip/brotli-compress GridFS image streams — binary piping + compression can break images in some environments.
   */
  app.use(
    compression({
      filter: (req, res) => {
        const p = req.path || "";
        if (p.includes("/uploads/image/") || p.startsWith("/api/uploads/image/")) return false;
        return compression.filter(req, res);
      },
    }),
  );
  app.use(hpp());

  app.post(
    "/api/payments/stripe/webhook",
    express.raw({ type: "application/json" }),
    require("./modules/payments/payment.controller").stripeWebhook(env),
  );

  app.use(
    cors({
      origin: (origin, cb) => {
        if (isOriginAllowed(env, origin)) return cb(null, true);
        return cb(new Error("CORS origin not allowed"), false);
      },
      credentials: true,
      /** Required for admin upload preflight (custom `x-admin-key`). */
      allowedHeaders: ["Content-Type", "Authorization", "x-admin-key", "X-Admin-Key", "Cookie"],
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Protect write surfaces by stripping Mongo operators from body + params (after parsing).
  app.use((req, _res, next) => {
    if (req.body) req.body = stripMongoOperators(req.body);
    if (req.params) req.params = stripMongoOperators(req.params);
    next();
  });

  // HTTP logging (payloads only when enabled)
  app.use((req, res, next) => {
    const start = Date.now();
    const shouldLogPayload =
      Boolean(env.LOG_HTTP_PAYLOADS) &&
      (req.path.startsWith("/api/users") || req.path.startsWith("/api/auth"));

    if (shouldLogPayload) {
      // eslint-disable-next-line no-console
      console.log("[http] request", {
        method: req.method,
        path: req.originalUrl || req.url,
        ip: req.ip,
        body: redactSensitive(req.body),
      });
    }

    res.on("finish", () => {
      const ms = Date.now() - start;
      // eslint-disable-next-line no-console
      console.log("[http] response", {
        method: req.method,
        path: req.originalUrl || req.url,
        status: res.statusCode,
        ms,
      });
    });
    next();
  });

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
  const productImageUploads = require("./modules/uploads/upload.routes")(env);
  app.use("/api/uploads", productImageUploads);
  /** Some proxies forward `/api/*` to the Node app with the `/api` prefix stripped; match `/uploads/*` too. */
  app.use("/uploads", productImageUploads);
  app.use("/api/orders", require("./modules/orders/orders.routes")(env));
  app.use("/api/analytics", require("./modules/analytics/analytics.routes")(env));
  app.use("/api/admin/analytics", require("./modules/admin-analytics/admin-analytics.routes")(env));
  app.use("/api/chatbot", require("./modules/chatbot/chatbot.routes")(env));
  app.use("/api/chat", require("./modules/chat/chat.routes")(env));
  app.use("/api/payments", require("./modules/payments/payment.routes")(env));

  app.use((_req, res) => res.status(404).json({ error: { code: "not_found", message: "Route not found" } }));
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };

