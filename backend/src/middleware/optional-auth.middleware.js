const jwt = require("jsonwebtoken");

/** Attaches req.user when Bearer token is valid; always continues. */
function optionalAuthMiddleware(env) {
  return (req, _res, next) => {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    if (token) {
      try {
        const payload = jwt.verify(token, env.JWT_SECRET);
        req.user = { userId: payload.userId, role: payload.role };
      } catch {
        // ignore invalid token
      }
    }
    const guest =
      req.headers["x-guest-session"] ||
      req.headers["x-guest-session-id"] ||
      req.body?.guestSessionId;
    if (guest) req.guestSessionId = String(guest).trim().slice(0, 64);
    return next();
  };
}

module.exports = { optionalAuthMiddleware };
