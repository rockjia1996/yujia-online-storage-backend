const { verifyJWT } = require("../utils/authenticate");

// isAuthorize is a middleware function that check if the JWT is valid
function isAuthorize(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).send("Access denied. No token provided");
    return;
  }

  try {
    const decoded = verifyJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}

module.exports = { isAuthorize };
