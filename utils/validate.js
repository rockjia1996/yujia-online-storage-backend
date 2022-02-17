const Joi = require("joi");

// Joi schema for the registeration form
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  repeatedPassword: Joi.ref("password"),
});

// Joi schema for the login form
const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

// Validate the login inputs with the login schema
async function validateLogin(details) {
  try {
    return await loginSchema.validateAsync(details);
  } catch (error) {
    console.log(error.message);
  }
}

// Validate the registeration input with the regiseration schema
async function validateRegister(details) {
  try {
    return await registerSchema.validateAsync(details);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  validateLogin,
  validateRegister,
};
