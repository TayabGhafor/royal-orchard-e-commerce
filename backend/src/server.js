require("dotenv").config();

const { loadEnv } = require("./config/env");
const { connectDB } = require("./config/db");
const { createApp } = require("./app");
const { seedDefaultProducts } = require("./modules/products/products.seed");

async function main() {
  const env = loadEnv(process.env);
  await connectDB(env.MONGODB_URI, env);
  await seedDefaultProducts();

  const app = createApp(env);
  app.listen(env.PORT, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`RoyalOrchard API listening on :${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal startup error:", err);
  process.exit(1);
});

