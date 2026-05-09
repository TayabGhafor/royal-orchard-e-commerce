const required = (value, key) => {
  if (!value || String(value).trim().length === 0) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
};

function loadEnv(processEnv) {
  const nodeEnv = processEnv.NODE_ENV || "development";
  const port = Number(processEnv.PORT || 5000);

  const jwtSecret = required(processEnv.JWT_SECRET, "JWT_SECRET");
  if (jwtSecret.length < 16) throw new Error("JWT_SECRET must be at least 16 characters");

  const parseCsv = (v) => (v || "").split(",").map((s) => s.trim()).filter(Boolean);
  const toBool = (v, defaultValue = false) => {
    if (v === undefined || v === null || String(v).trim() === "") return defaultValue;
    return ["1", "true", "yes", "y", "on"].includes(String(v).trim().toLowerCase());
  };

  const env = {
    NODE_ENV: nodeEnv,
    PORT: port,
    MONGODB_URI: required(processEnv.MONGODB_URI, "MONGODB_URI"),
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: processEnv.JWT_EXPIRES_IN || "7d",
    ADMIN_API_KEY: required(processEnv.ADMIN_API_KEY, "ADMIN_API_KEY"),
    CORS_ORIGINS: parseCsv(processEnv.CORS_ORIGINS),
    MONGODB_DNS_SERVERS: parseCsv(processEnv.MONGODB_DNS_SERVERS),
    LOG_HTTP_PAYLOADS: toBool(processEnv.LOG_HTTP_PAYLOADS, nodeEnv !== "production"),
    LOG_USER_PAYLOADS: toBool(processEnv.LOG_USER_PAYLOADS, nodeEnv !== "production"),
    LOG_MONGO_QUERIES: toBool(processEnv.LOG_MONGO_QUERIES, false),
    OPENAI_API_KEY: String(processEnv.OPENAI_API_KEY || "").trim(),
    /** Optional absolute base for image URLs (defaults to RENDER_EXTERNAL_URL on Render). */
    API_PUBLIC_URL: String(processEnv.API_PUBLIC_URL || processEnv.RENDER_EXTERNAL_URL || "").trim(),
  };

  return env;
}

module.exports = { loadEnv };

