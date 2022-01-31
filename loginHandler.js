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
  username: String,
  password: String,
});

const Logger = mongoose.model("Login", loginSchema);

// Create User in the Login collection
async function createUser(username, password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  const user = new Logger({
    username: username,
    password: hash,
  });

  return await user.save();
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

//createUser("guest", "123");
//verifyUser("guest", "123");
//deleteUser("guest");

module.exports = {
  createUser,
  verifyUser,
  deleteUser,
};
