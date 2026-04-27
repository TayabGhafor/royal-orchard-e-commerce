const jwt = require("jsonwebtoken");

function generateToken({ userId, role }, { secret, expiresIn }) {
  return jwt.sign({ userId, role }, secret, { expiresIn });
}

module.exports = { generateToken };

