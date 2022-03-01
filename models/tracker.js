const res = require("express/lib/response");
const mongoose = require("mongoose");

// URL configation
const dataBaseURL =
  process.env.storage_db || "mongodb://localhost:27017/my-online-storage-app";

// Connect to the MongoDB database
mongoose
  .connect(dataBaseURL)
  .then(() => console.log("(tracker.js) Connected to MongoDB ..."))
  .catch((error) => console.log(error.message));

// Define the a tracker schema to specify
// what to track

const trackerSchema = new mongoose.Schema({
  filename: { type: String, require: true },
  path: { type: String, require: true },
  owner: { type: String, require: true },
  size: { type: Number },
  date: { type: Date, default: Date.now() },
  tags: [String],
  notes: { type: String, default: "" },
});

// Complie tracker schema to model
const Tracker = mongoose.model("Tracker", trackerSchema);

// Create a tracker to track the uploaded file
async function createFileTracker(details) {
  const { filename, path, owner, tags, notes, size } = details;
  const tracker = new Tracker({
    filename,
    path,
    owner,
    tags,
    notes,
    size,
  });

  try {
    return await tracker.save();
  } catch (error) {
    console.log(error.message);
  }
}

// Retrive a tracker based on the filter
async function retriveFileTracker(filter) {
  try {
    const { filename, owner } = filter;
    return await Tracker.findOne({ filename, owner });
  } catch (error) {
    console.log(error.message);
  }
}

// Update a tracker by find it first based on the filter,
// then update it based on given object update
async function updateFileTracker(filter, update) {
  try {
    return await Tracker.findOneAndUpdate(filter, update);
  } catch (error) {
    console.log(error.message);
  }
}

// Delete a tracker based on the given filter
async function deleteFileTracker(filter) {
  try {
    return await Tracker.findOneAndDelete(filter);
  } catch (error) {
    console.log(error.message);
  }
}

// Search trackers based on the filter
async function searchFileTrackers(filter) {
  try {
    return await Tracker.find(filter);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  createFileTracker,
  retriveFileTracker,
  updateFileTracker,
  deleteFileTracker,
  searchFileTrackers,
};

/*
const details = {
  filename: "test-file-1.txt",
  path: __dirname + "/testUser/test-file-1.txt",
  owner: "Yu Jia",
  tags: [],
  notes: "",
};
*/

//createFileTracker(details);
//retriveFileTracker({ filename: "test-file-1.txt", owner: "Yu Jia" });

/*
  updateFileTracker(
    { filename: details.filename, owner: details.owner },
    { filename: "helloWorld.txt" }
  );
*/

//deleteFileTracker({ filename: details.filename, owner: details.owner });
//searchFileTrackers({ owner: "Yu Jia" });
