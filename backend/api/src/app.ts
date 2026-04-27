import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";
import { authRouter } from "./routes/auth";
import { productsRouter } from "./routes/products";
import { meRouter } from "./routes/me";
import { addressesRouter } from "./routes/addresses";

export function createApp(opts: { corsOrigins: string[] }) {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (opts.corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error("CORS origin not allowed"), false);
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
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

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.get("/api/v1/health", (_req, res) => res.json({ ok: true }));

  app.use(
    "/api/v1/auth",
    authRouter({
      accessSecret: process.env.JWT_ACCESS_SECRET || "missing",
      refreshSecret: process.env.JWT_REFRESH_SECRET || "missing",
      accessTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 900),
      refreshTtlSeconds: Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 1209600),
    }),
  );
  app.use("/api/v1/products", productsRouter());
  app.use("/api/v1/me", meRouter({ accessSecret: process.env.JWT_ACCESS_SECRET || "missing" }));
  app.use("/api/v1/me/addresses", addressesRouter({ accessSecret: process.env.JWT_ACCESS_SECRET || "missing" }));

  app.use((_req, res) => res.status(404).json({ error: { code: "not_found", message: "Route not found" } }));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error({ err }, "Unhandled error");
    res.status(500).json({ error: { code: "internal_error", message: "Internal server error" } });
  });

  return app;
}

