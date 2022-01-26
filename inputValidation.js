const Joi = require("joi");

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

function validateLogin(user) {
  const result = loginSchema.validate(user);
  console.log(result);
  if (!result.error) return true;
  else return false;
}

module.exports = validateLogin;
