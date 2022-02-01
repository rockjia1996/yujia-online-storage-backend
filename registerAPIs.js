const express = require("express");
const router = express.Router();
const loginHandler = require("./loginHandler");
const inputValidation = require("./inputValidation");

// The route handles the registion of the client
router.post("/api/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const repeatPassword = req.body.repeatPassword;
  const email = req.body.email;

  const result = inputValidation.validateRegister({
    username: username,
    password: password,
    repeatPassword: repeatPassword,
    email: email,
  });

  if (result) {
    const isSuccess = await loginHandler.createUser(username, password, email);
    if (isSuccess) res.redirect("/login");
    else res.redirect("/register");
  } else res.redirect("/register");
});

module.exports = router;
