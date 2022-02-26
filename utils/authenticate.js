const jwt = require("jsonwebtoken");

// The secret MUST NOT APPEAR IN THE SOURCE CODE
// For now it is good, need to export to the environment variable in the
// future
const devSecretKey = "The secret should never appear in the source code!";

// Generate the JWT
function generateJWT(payload, time) {
  const secretKey = process.env.secretKey || devSecretKey;
  return jwt.sign(payload, secretKey);
}

// Verify the JWT
function verifyJWT(token) {
  const secretKey = process.env.secretKey || devSecretKey;
  return jwt.verify(token, secretKey);
}

module.exports = {
  generateJWT,
  verifyJWT,
};
