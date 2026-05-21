require("dotenv").config();

const { loadEnv } = require("./config/env");
const { connectDB } = require("./config/db");
const { createApp } = require("./app");
const { seedDefaultProducts } = require("./modules/products/products.seed");
const { seedSiteKnowledge } = require("./modules/chatbot/site-knowledge.seed");
const { seedBlogs } = require("./modules/blogs/blogs.seed");
const { seedAnalyticsDemo } = require("./modules/analytics/analytics-demo.seed");

async function main() {
  const env = loadEnv(process.env);
  await connectDB(env.MONGODB_URI, env);
  await seedDefaultProducts();
  try {
    await seedSiteKnowledge();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[chatbot] site knowledge seed failed:", err?.message || err);
  }
  try {
    await seedAnalyticsDemo();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[analytics] demo seed failed:", err?.message || err);
  }
  try {
    await seedBlogs();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[blogs] seed failed:", err?.message || err);
  }

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

