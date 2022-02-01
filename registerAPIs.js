const express = require("express");
const router = express.Router();
const loginHandler = require("./loginHandler");
const inputValidation = require("./inputValidation");

// The route handles the registion of the client
router.post("/api/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const repeatPassword = req.body.repeatPassword;

  if (password === repeatPassword) {
    const result = inputValidation.validateRegister({
      username: username,
      password: password,
    });

    if (result) {
      const isSuccess = await loginHandler.createUser(username, password);

      if (isSuccess) res.redirect("/login");
    }
  }

  res.redirect("/register");
});

module.exports = router;
