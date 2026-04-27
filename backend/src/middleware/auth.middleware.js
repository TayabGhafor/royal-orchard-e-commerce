const jwt = require("jsonwebtoken");

function authMiddleware(env) {
  return (req, _res, next) => {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (!token) {
      return next(Object.assign(new Error("Unauthorized"), { statusCode: 401, code: "unauthorized" }));
    }
    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      req.user = { userId: payload.userId, role: payload.role };
      return next();
    } catch (_e) {
      return next(Object.assign(new Error("Invalid token"), { statusCode: 401, code: "invalid_token" }));
    }
  };
}

module.exports = { authMiddleware };

