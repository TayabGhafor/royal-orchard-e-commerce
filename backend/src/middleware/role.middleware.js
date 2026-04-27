function requireAdmin(req, _res, next) {
  if (!req.user || req.user.role !== "admin") {
    return next(Object.assign(new Error("Forbidden"), { statusCode: 403, code: "forbidden" }));
  }
  return next();
}

module.exports = { requireAdmin };

