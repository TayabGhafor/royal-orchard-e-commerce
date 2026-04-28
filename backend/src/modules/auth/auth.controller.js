const validator = require("validator");
const { generateToken } = require("../../utils/generateToken");
const { hashPassword, comparePassword } = require("../../utils/hashPassword");
const { User } = require("../users/user.model");

function sanitizeString(s) {
  return validator.trim(String(s || ""));
}

function logUserPayload(req, label, payload) {
  const env = req.app?.get?.("envConfig");
  if (!env?.LOG_USER_PAYLOADS) return;
  const safe = JSON.parse(JSON.stringify(payload || {}, (k, v) => (k.toLowerCase() === "password" ? "[REDACTED]" : v)));
  // eslint-disable-next-line no-console
  console.log(label, safe);
}

function register(env) {
  return async (req, res, next) => {
    try {
      const name = sanitizeString(req.body.name);
      const email = validator.normalizeEmail(String(req.body.email || "")) || "";
      const password = String(req.body.password || "");

      if (!name) throw Object.assign(new Error("Name is required"), { statusCode: 400, code: "invalid_name" });
      if (!validator.isEmail(email)) throw Object.assign(new Error("Valid email is required"), { statusCode: 400, code: "invalid_email" });
      if (password.length < 8) throw Object.assign(new Error("Password must be at least 8 characters"), { statusCode: 400, code: "invalid_password" });

      logUserPayload(req, "[auth] register payload", { name, email });

      const exists = await User.findOne({ email }).lean();
      if (exists) throw Object.assign(new Error("Email already in use"), { statusCode: 409, code: "email_taken" });

      const passwordHash = await hashPassword(password);
      const user = await User.create({
        name,
        email,
        password: passwordHash,
        role: "customer",
        isVerified: false,
      });

      logUserPayload(req, "[auth] register stored", {
        id: user._id?.toString?.(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      });

      const token = generateToken({ userId: user._id.toString(), role: user.role }, { secret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRES_IN });

      res.status(201).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  };
}

function login(env) {
  return async (req, res, next) => {
    try {
      const email = validator.normalizeEmail(String(req.body.email || "")) || "";
      const password = String(req.body.password || "");

      if (!validator.isEmail(email)) throw Object.assign(new Error("Valid email is required"), { statusCode: 400, code: "invalid_email" });
      if (!password) throw Object.assign(new Error("Password is required"), { statusCode: 400, code: "invalid_password" });

      logUserPayload(req, "[auth] login payload", { email });

      const user = await User.findOne({ email }).select("+password");
      if (!user) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401, code: "invalid_credentials" });

      const ok = await comparePassword(password, user.password);
      if (!ok) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401, code: "invalid_credentials" });

      logUserPayload(req, "[auth] login fetched", {
        id: user._id?.toString?.(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        updatedAt: user.updatedAt,
      });

      const token = generateToken({ userId: user._id.toString(), role: user.role }, { secret: env.JWT_SECRET, expiresIn: env.JWT_EXPIRES_IN });

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  };
}

function me() {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId).select("-password").lean();
      if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404, code: "user_not_found" });
      res.json({ user });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { register, login, me };

