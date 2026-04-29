const jwt = require("jsonwebtoken");

function generateToken({ userId, role }, { secret, expiresIn }) {
  return jwt.sign({ userId, role }, secret, { expiresIn });
}

/** Short-lived JWT after the user verifies their email reset code (before choosing a new password). */
function generatePasswordResetToken(userId, { secret, expiresIn = "15m" }) {
  return jwt.sign({ userId, typ: "pwd_reset" }, secret, { expiresIn });
}

module.exports = { generateToken, generatePasswordResetToken };

