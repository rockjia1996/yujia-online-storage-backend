const path = require("path");

const _ = require("lodash");
const express = require("express");
const router = express.Router();

const { createUser, searchUser } = require("../models/user");
const { validateRegister } = require("../utils/validate");
const { hashPassword } = require("../utils/encrypt");
const { createFolder } = require("../utils/diskio");

/*
  Route: /api/register
  Method: POST
  Accessiblity: Public

  Description:
    The router handles the register request from the client.

    Server extracts the username, email, password, and repeatedPassword from
    the request body (req.body). Then validate it. 
    
    If valid, hash to password and check the database if such client had 
    registered.

    If invalid, send 400;


    If database query returns no such user, create the new user in the database
    and return the user id, username, and id back to the client.

*/
router.post("/api/register", async (req, res) => {
  // Extract the username, email, password, repeatedPassword
  const inputs = _.pick(req.body, [
    "username",
    "email",
    "password",
    "repeatedPassword",
  ]);
  const details = await validateRegister(inputs); // validation the inputs

  if (!details) return res.sendStatus(400);
  details["password"] = await hashPassword(details["password"]); // hashing

  // Verify if the client already registered.
  const repeatedUser = await searchUser({ email: details["email"] });
  if (repeatedUser) return res.send({ isEmailUsed: true });

  const user = await createUser(details);

  // Create a folder to save the client's uploads
  const userFolder = path.resolve(".", "storage", user._id.toString());

  if (user) await createFolder(userFolder);
  res.send(_.pick(user, ["_id", "username", "email"]));
});

module.exports = router;
