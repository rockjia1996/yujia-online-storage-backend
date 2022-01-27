const express = require("express");
const fs = require("fs");
const validateLogin = require("./inputValidation");
const router = express.Router();

/*
  This API validates user's information. If the 
  provided information is valid. The isAuth and 
  username will be set in req.session. Also it creates
  a storage folder for the user.
*/
router.post("/api/validate", (req, res) => {
  const user = req.body;
  const valid = validateLogin(user);

  if (valid) {
    req.session.isAuth = true;
    req.session.username = user.username;
    fs.mkdirSync(`upload/${req.session.username}`, { recursive: true });
    res.redirect("/upload");
  } else res.redirect("/login");
});

module.exports = router;
