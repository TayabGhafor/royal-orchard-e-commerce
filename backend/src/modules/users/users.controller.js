const validator = require("validator");
const sanitizeHtml = require("sanitize-html");
const { User } = require("./user.model");

function sanitizeText(s) {
  const trimmed = validator.trim(String(s || ""));
  return sanitizeHtml(trimmed, { allowedTags: [], allowedAttributes: {} });
}

function getProfile() {
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

      const user = await User.findByIdAndUpdate(req.user.userId, { $set: patch }, { new: true })
        .select("-password")
        .lean();
      if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404, code: "user_not_found" });
      res.json({ user });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { getProfile, updateProfile };

