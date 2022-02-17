const jwt = require("jsonwebtoken");

// The secret MUST NOT APPEAR IN THE SOURCE CODE
// For now it is good, need to export to the environment variable in the
// future
const secretKey = "The secret should never appear in the source code!";

// Generate the JWT
function generateJWT(payload, time) {
  return jwt.sign(payload, secretKey);
}

// Verify the JWT
function verifyJWT(token) {
  return jwt.verify(token, secretKey);
}

module.exports = {
  generateJWT,
  verifyJWT,
};
