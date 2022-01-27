const Joi = require("joi");

// Joi schema for validation
const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

// Check the info that user provides is in correct format.
function validateLogin(user) {
  const result = loginSchema.validate(user);
  console.log(result);
  if (!result.error) return true;
  else return false;
}

module.exports = validateLogin;
