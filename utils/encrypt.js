const bcrypt = require("bcrypt");

// Hash the given password, returns the hash string
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.log(error.message);
  }
}

// Compare the given password with hash, returns true if password is valid,
// else false.
async function checkPassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  hashPassword,
  checkPassword,
};
