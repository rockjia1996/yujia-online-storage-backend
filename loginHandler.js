const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect("mongodb://localhost/login_db")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.error("Could not connect to MongDB..."));
}

function closeConnection() {
  mongoose.connection.close();
}

connectDB();

const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
  salt: String,
});

const Logger = mongoose.model("Login", loginSchema);

async function createUser(username, password) {
  // For Now, it is plain text, in the future,
  // these fields will be filled by hashes
  // Also the username should be unique, so
  // no two users have the same name
  const user = new Logger({
    username: username,
    password: password,
    salt: "just a placeholder",
  });

  return await user.save();
}

async function verifyUser(username, password) {
  const user = await Logger.find({
    username: username,
  });

  if (user[0].password === password) {
    console.log("verified");
  } else console.log("not verified");
}

async function deleteUser(username) {
  const user = await Logger.findOne({ username: username });
  return await Logger.deleteOne(user._id);
}

createUser("guest", "123");
//verifyUser("guest", "123");
//deleteUser("guest");
