const express = require("express");
const validateLogin = require("./inputValidation");
const router = express.Router();

router.post("/user", (req, res) => {
  const user = req.body;
  const valid = validateLogin(user);

  if (valid) res.redirect("/upload.html");
  else res.redirect("/login.html");
});

module.exports = router;
