const Joi = require("joi");

// Joi schema for login validation
const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

// Joi schema for register validation
// The Email field will be added in the future
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

// Validate the format of the user's information
function validateLogin(user) {
  const result = loginSchema.validate(user);
  if (!result.error) return true;
  else return false;
}

// Validate the format of the user's register information
function validateRegister(user) {
  const result = registerSchema.validate(user);
  if (!result.error) return true;
  else return false;
}

module.exports = { validateLogin, validateRegister };
