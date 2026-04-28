function requireAdminKey(env) {
  return (req, _res, next) => {
    try {
      const key = String(req.header("x-admin-key") || "");
      if (!env.ADMIN_API_KEY || key !== env.ADMIN_API_KEY) {
        throw Object.assign(new Error("Unauthorized"), { statusCode: 401, code: "unauthorized" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { requireAdminKey };

