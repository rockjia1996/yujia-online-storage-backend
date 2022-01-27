const express = require("express");
const fs = require("fs");
const validateLogin = require("./inputValidation");
const router = express.Router();

router.post("/api/validate", (req, res) => {
  const user = req.body;
  const valid = validateLogin(user);
  console.log(user);
  if (valid) {
    req.session.isAuth = true;
    req.session.username = user.username;
    fs.mkdirSync(`upload/${req.session.username}`);
    res.redirect("/upload");
  } else res.redirect("/login");
});

module.exports = router;
