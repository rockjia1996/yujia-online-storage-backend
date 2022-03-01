const mongoose = require("mongoose");

// URL configation
const dataBaseURL =
  process.env.storage_db || "mongodb://localhost:27017/my-online-storage-app";

mongoose
  .connect(dataBaseURL)
  .then(() =>
    console.log(`(user.js) Connected to MongoDB with ${dataBaseURL}...`)
  )
  .catch((error) => console.log(error.message));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Create user based on username, email, password
async function createUser(details) {
  const { username, email, password } = details;
  const user = new User({
    username,
    email,
    password,
  });

  try {
    return await user.save();
  } catch (error) {
    console.log(error.message);
  }
}

// Search a user based on the filter
async function searchUser(filter) {
  try {
    return await User.findOne(filter);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { createUser, searchUser };
