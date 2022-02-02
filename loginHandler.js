const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Connect to the database
function connectDB() {
  mongoose
    .connect("mongodb://localhost/yujia-online-storage-db")
    .then(() => console.log("(loginHandler) Connected to MongoDB..."))
    .catch((error) => {
      console.error("(loginHandler) Could not connect to MongDB...");
    });
}

function closeConnection() {
  mongoose.connection.close();
}

connectDB();

// The schema for a user document
const loginSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  email: { type: String, require: true, unique: true },
});

const Logger = mongoose.model("Login", loginSchema);

// Create User in the Login collection
async function createUser(username, password, email) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  const user = new Logger({
    username: username,
    password: hash,
    email: email,
  });

  try {
    const result = await user.save();
    return true;
  } catch (err) {
    // Anything goes wrong return null to the caller
    console.log(err.message);
    return false;
  }
}

// Verify the provided information against database
async function verifyUser(username, password) {
  const user = await Logger.find({
    username: username,
  });

  if (user.length === 0) return false;
  else return await bcrypt.compare(password, user[0].password);
}

// Delete user from the database
async function deleteUser(username) {
  const user = await Logger.findOne({ username: username });
  return await Logger.deleteOne(user._id);
}

//createUser("", "123");
//verifyUser("guest", "123");
//deleteUser("guest");

module.exports = {
  createUser,
  verifyUser,
  deleteUser,
};
