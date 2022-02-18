const _ = require("lodash");
const express = require("express");
const router = express.Router();

const { checkPassword } = require("../utils/encrypt");
const { validateLogin } = require("../utils/validate");
const { searchUser } = require("../models/user");
const { generateJWT } = require("../utils/authenticate");

/*
  Route: /api/login
  Method: POST
  Accessiblity: Public

  Description: 
    The route handles the login request from the client.

    Server will extract the login credentials from req.body, req.body.email
    for email, req.body.password for password. Then the credentials will be
    checked against the database. 

    If valid, generate JWT and send it to the client
    If invalid, send json object {isAuth: false } to the client

*/

router.post("/api/login", async (req, res) => {
  // Extract and verify the login credential
  const inputs = _.pick(req.body, ["email", "password"]);
  const details = await validateLogin(inputs);
  if (!details) return res.send({ isValid: false });

  const user = await searchUser({ email: details["email"] });

  // Check if such user exist in the database
  if (!user) return res.send({ isAuth: false });

  const isAuth = await checkPassword(details["password"], user.password);

  // Check if password is valid
  if (!isAuth) return res.send({ isAuth: false });

  // Generate JWT with id and email
  const token = generateJWT({ id: user._id, email: details["email"] });
  res.send({ id: user._id, email: user.email, jwt: token });
});

module.exports = router;
