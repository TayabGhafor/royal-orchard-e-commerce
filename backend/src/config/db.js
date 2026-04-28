const mongoose = require("mongoose");
const dns = require("dns");

function redactMongoUri(uri) {
  try {
    const u = new URL(uri);
    if (u.username || u.password) {
      u.username = u.username ? "****" : "";
      u.password = u.password ? "****" : "";
    }
    return u.toString();
  } catch {
    return String(uri).replace(/\/\/([^:@/]+):([^@/]+)@/g, "//****:****@");
  }
}

function redactObj(value) {
  if (!value || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(redactObj);
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    const lower = k.toLowerCase();
    if (["password", "token", "access_token", "refresh_token", "jwt", "secret", "authorization"].includes(lower)) {
      out[k] = "[REDACTED]";
    } else {
      out[k] = redactObj(v);
    }
  }
  return out;
}

async function connectDB(mongoUri, opts = {}) {
  mongoose.set("strictQuery", true);
  const nodeEnv = opts.NODE_ENV || process.env.NODE_ENV || "development";

  // Fix for environments where SRV DNS lookups fail (ENODATA/ENOTFOUND).
  // If MONGODB_DNS_SERVERS is provided, prefer it.
  if (String(mongoUri || "").startsWith("mongodb+srv://")) {
    const servers =
      (opts.MONGODB_DNS_SERVERS && opts.MONGODB_DNS_SERVERS.length ? opts.MONGODB_DNS_SERVERS : null) ||
      (nodeEnv !== "production" ? ["1.1.1.1", "8.8.8.8"] : null);
    if (servers) {
      try {
        dns.setServers(servers);
      } catch {
        // ignore; some environments disallow overriding resolvers
      }
    }
  }

  mongoose.connection.on("connected", () => {
    // eslint-disable-next-line no-console
    console.log("[mongo] connected");
  });
  mongoose.connection.on("disconnected", () => {
    // eslint-disable-next-line no-console
    console.warn("[mongo] disconnected");
  });
  mongoose.connection.on("error", (err) => {
    // eslint-disable-next-line no-console
    console.error("[mongo] connection error", err);
  });

  if (opts.LOG_MONGO_QUERIES) {
    mongoose.set("debug", function debug(collectionName, method, query, doc, options) {
      // Only log users collection by default (to keep noise low)
      if (collectionName !== "users") return;
      // eslint-disable-next-line no-console
      console.log("[mongo]", collectionName, method, {
        query: redactObj(query),
        doc: redactObj(doc),
        options: redactObj(options),
      });
    });
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 15_000,
    });
  } catch (err) {
    if (err && (err.code === "ENODATA" || err.code === "ENOTFOUND") && String(mongoUri).startsWith("mongodb+srv://")) {
      // eslint-disable-next-line no-console
      console.error(
        "[mongo] SRV DNS lookup failed for mongodb+srv URI. " +
          "This is usually a DNS/network issue. " +
          "Tried overriding DNS resolvers; if it still fails, use the Atlas 'Standard connection string (mongodb://...)' instead of SRV. " +
          `uri=${redactMongoUri(mongoUri)}`,
      );
    }
    throw err;
  }
  return mongoose.connection;
}

module.exports = { connectDB };

