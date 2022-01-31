const express = require("express");
const fs = require("fs");
const inputValidation = require("./inputValidation");
const loginHandler = require("./loginHandler");

const router = express.Router();

/*
  This API validates user's information. If the 
  provided information is valid. The isAuth and 
  username will be set in req.session. Also it creates
  a storage folder for the user.
*/
router.post("/api/validate", async (req, res) => {
  const user = req.body;
  const valid = inputValidation.validateLogin(user);

  // If the format is correct, check the password against database
  if (valid) {
    const result = await loginHandler.verifyUser(user.username, user.password);

    // If the username and password is valid
    if (result) {
      // Store the session cookie in the client
      req.session.isAuth = true;
      req.session.username = user.username;

      // Create a user folder to store, the user's files
      fs.mkdirSync(`upload/${req.session.username}`, { recursive: true });
      res.redirect("/upload");
    } else {
      res.redirect("/login");
    }
  } else res.redirect("/login");
});

module.exports = router;
