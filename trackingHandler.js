const mongoose = require("mongoose");

// Connect to the MongoDB database
function connectDB() {
  mongoose
    .connect("mongodb://localhost/file_tracking_db")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.error("Could not connnect to MongoDB..."));
}

// Close the connection to the database
function closeConnection() {
  mongoose.connection.close();
}

// Connect to Database now
connectDB();

// Define a trackerSchema to specify how to track the file
const trackerSchema = new mongoose.Schema({
  filename: String,
  owner: String,
  date: { type: Date, default: Date.now },
});

// Compile schema to model
const FileTracker = mongoose.model("FileTrack", trackerSchema);

// Create a tracker to track the uploaded file
async function createTracker(filename, owner, path) {
  const tracker = new FileTracker({
    filename: filename,
    owner: owner,
    path: path,
  });

  return await tracker.save();
}

// Get the location information about the file
async function getTracker(filename, owner) {
  const tracker = await FileTracker.find({
    filename: filename,
    owner: owner,
  });
  return tracker;
}

// Delete a filename with a given filename and owner name
async function deleteTracker(filename, owner) {
  const tracker = await getTracker(filename, owner);
  const result = await FileTracker.findByIdAndDelete(tracker[0].id);
  return result;
}

module.exports = {
  createTracker,
  getTracker,
  deleteTracker,
  closeConnection,
};
