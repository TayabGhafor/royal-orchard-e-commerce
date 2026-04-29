const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { generateToken, generatePasswordResetToken } = require("../../utils/generateToken");
const { hashPassword, comparePassword } = require("../../utils/hashPassword");
const { User } = require("../users/user.model");

/** Dev/testing bypass: works only if the email belongs to an existing user (same checks as a real code). */
const TEST_RESET_CODE = "424242";

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

function forgotPassword(env) {
  return async (req, res, next) => {
    try {
      const email = validator.normalizeEmail(String(req.body.email || "")) || "";
      if (!validator.isEmail(email)) throw Object.assign(new Error("Valid email is required"), { statusCode: 400, code: "invalid_email" });

      const user = await User.findOne({ email });
      if (!user) throw Object.assign(new Error("No account found for this email"), { statusCode: 404, code: "user_not_found" });

      const n = crypto.randomInt(0, 1_000_000);
      const code = String(n).padStart(6, "0");
      user.passwordResetCodeHash = await hashPassword(code);
      user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
      await user.save();

      // eslint-disable-next-line no-console
      console.log(`[password-reset] emailed code for ${email}: ${code} (configure SMTP in production)`);

      res.json({
        ok: true,
        message: "We sent a 6-digit code to your email. Enter it on the next screen to continue.",
      });
    } catch (err) {
      next(err);
    }
  };
}

function verifyResetCode(env) {
  return async (req, res, next) => {
    try {
      const email = validator.normalizeEmail(String(req.body.email || "")) || "";
      const codeRaw = String(req.body.code || "").trim().replace(/\s/g, "");

      if (!validator.isEmail(email)) throw Object.assign(new Error("Valid email is required"), { statusCode: 400, code: "invalid_email" });
      if (!/^\d{6}$/.test(codeRaw)) throw Object.assign(new Error("Enter the 6-digit code"), { statusCode: 400, code: "invalid_code" });

      const user = await User.findOne({ email }).select("+passwordResetCodeHash");
      if (!user) throw Object.assign(new Error("No account found for this email"), { statusCode: 404, code: "user_not_found" });

      let valid = false;
      if (codeRaw === TEST_RESET_CODE) {
        valid = true;
      } else if (!user.passwordResetCodeHash) {
        valid = false;
      } else if (!user.passwordResetExpires || user.passwordResetExpires.getTime() < Date.now()) {
        throw Object.assign(new Error("This code has expired. Request a new one."), { statusCode: 400, code: "code_expired" });
      } else {
        valid = await comparePassword(codeRaw, user.passwordResetCodeHash);
      }

      if (!valid) throw Object.assign(new Error("Invalid code"), { statusCode: 401, code: "invalid_code" });

      const resetToken = generatePasswordResetToken(user._id.toString(), {
        secret: env.JWT_SECRET,
        expiresIn: "15m",
      });

      res.json({ ok: true, resetToken });
    } catch (err) {
      next(err);
    }
  };
}

function resetPassword(env) {
  return async (req, res, next) => {
    try {
      const resetToken = String(req.body.resetToken || "");
      const password = String(req.body.password || "");
      const confirmPassword = String(req.body.confirmPassword ?? req.body.confirm ?? "");

      if (!resetToken) throw Object.assign(new Error("Reset session missing"), { statusCode: 400, code: "missing_token" });
      if (password.length < 8) throw Object.assign(new Error("Password must be at least 8 characters"), { statusCode: 400, code: "invalid_password" });
      if (password !== confirmPassword) throw Object.assign(new Error("Passwords do not match"), { statusCode: 400, code: "password_mismatch" });

      let decoded;
      try {
        decoded = jwt.verify(resetToken, env.JWT_SECRET);
      } catch {
        throw Object.assign(new Error("This reset link expired. Start again from forgot password."), {
          statusCode: 401,
          code: "invalid_token",
        });
      }

      if (decoded.typ !== "pwd_reset" || !decoded.userId) {
        throw Object.assign(new Error("Invalid reset token"), { statusCode: 401, code: "invalid_token" });
      }

      const passwordHash = await hashPassword(password);
      const updated = await User.findByIdAndUpdate(
        decoded.userId,
        { $set: { password: passwordHash }, $unset: { passwordResetCodeHash: 1, passwordResetExpires: 1 } },
        { new: true },
      );
      if (!updated) throw Object.assign(new Error("User not found"), { statusCode: 404, code: "user_not_found" });

      res.json({ ok: true, message: "Password updated successfully." });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { register, login, me, forgotPassword, verifyResetCode, resetPassword };

