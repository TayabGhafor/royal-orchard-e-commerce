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

  const env = {
    NODE_ENV: nodeEnv,
    PORT: port,
    MONGODB_URI: required(processEnv.MONGODB_URI, "MONGODB_URI"),
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: processEnv.JWT_EXPIRES_IN || "7d",
    CORS_ORIGINS: (processEnv.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
  };

  return env;
}

module.exports = { loadEnv };

