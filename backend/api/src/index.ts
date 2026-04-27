import "dotenv/config";
import { loadEnv } from "./config/env";
import { connectMongo } from "./db/mongoose";
import { createApp } from "./app";
import { logger } from "./lib/logger";

async function main() {
  const env = loadEnv(process.env);

  await connectMongo(env.MONGODB_URI);

  const corsOrigins = env.CORS_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  const app = createApp({ corsOrigins });

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "API listening");
  });
}

main().catch((err) => {
  logger.error({ err }, "Fatal startup error");
  process.exit(1);
});

