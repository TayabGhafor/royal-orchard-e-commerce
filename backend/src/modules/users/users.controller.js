const validator = require("validator");
const sanitizeHtml = require("sanitize-html");
const { User } = require("./user.model");

function sanitizeText(s) {
  const trimmed = validator.trim(String(s || ""));
  return sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} });
}

function redactUser(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

function getProfile() {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId).select("-password").lean();
      if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404, code: "user_not_found" });
      if (req.app?.get?.("envConfig")?.LOG_USER_PAYLOADS) {
        // eslint-disable-next-line no-console
        console.log("[users] getProfile fetched", { userId: req.user.userId, user: redactUser(user) });
      }
      res.json({ user });
    } catch (err) {
      next(err);
    }
  };
}

function updateProfile() {
  return async (req, res, next) => {
    try {
      const patch = {};
      if (req.body.name !== undefined) patch.name = sanitizeText(req.body.name);
      if (req.body.phone !== undefined) patch.phone = sanitizeText(req.body.phone);
      if (req.body.avatar !== undefined) patch.avatar = sanitizeText(req.body.avatar);

      if (req.body.address) {
        patch.address = {
          fullAddress: sanitizeText(req.body.address.fullAddress),
          city: sanitizeText(req.body.address.city),
          area: sanitizeText(req.body.address.area),
        };
      }

      if (req.app?.get?.("envConfig")?.LOG_USER_PAYLOADS) {
        // eslint-disable-next-line no-console
        console.log("[users] updateProfile payload", { userId: req.user.userId, patch });
      }

      const user = await User.findByIdAndUpdate(req.user.userId, { $set: patch }, { returnDocument: "after" })
        .select("-password")
        .lean();
      if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404, code: "user_not_found" });

      if (req.app?.get?.("envConfig")?.LOG_USER_PAYLOADS) {
        // eslint-disable-next-line no-console
        console.log("[users] updateProfile stored", { userId: req.user.userId, user: redactUser(user) });
      }
      res.json({ user });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { getProfile, updateProfile };

