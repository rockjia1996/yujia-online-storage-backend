const path = require("path");
const _ = require("lodash");
const { deleteFile } = require("../utils/diskio");
const express = require("express");
const router = express.Router();

const {
  createFileTracker,
  retriveFileTracker,
  updateFileTracker,
  deleteFileTracker,
  searchFileTrackers,
} = require("../models/tracker");

const { isAuthorize } = require("../middlewares/authorize");
const { upload } = require("../middlewares/storage");

/* 
  Route: /api/filelist
  Method: GET
  Accessiblity: Protected

  Description:
    The route handles the request to fetch the list of files that client has 
    uploaded. 
    
    The server will search the database with client's email, then returns 
    the search results back to the client as an array of object.

*/
router.get("/api/filelist", isAuthorize, async (req, res) => {
  // Query database to get all the trackers that belong to the client
  const trackers = await searchFileTrackers({ owner: req.user.email });
  const filtered = trackers.map((tracker) => {
    return _.pick(tracker, "_id", "filename", "tags", "date", "notes");
  });
  res.send(filtered);
});

/*
  Route: /api/download
  Method: GET
  Accessiblity: Protected

  Description:
    The route handles the request of downloading a specific file. 
    
    The route will examines the req.body.filename for getting the filename. 
    
    If the client fails to provide a filename, server will send 400 response. 
    If the filename is provided, it will be check against the database to see 
    if such request from the client is valid. 
    
    If not, server will send 400 code. If it is valid, server will send the 
    file to the client.

*/
router.get("/api/download", isAuthorize, async (req, res) => {
  // Check if filename is provided
  const filename = req.body.filename;
  if (!filename) return res.sendStatus(400);

  // Check against the database
  const filter = { filename: req.body.filename, owner: req.user.email };
  const trackers = await searchFileTrackers(filter);
  if (trackers.length !== 1) return res.sendStatus(400);

  res.sendFile(trackers[0].path);
});

/*
  Route: /api/upload
  Method: POST
  Accessiblity: Protected

  Description:
    The route handles the file uploading request from the client. 
    
    The server will extract the filname, owner from the request. Then it 
    generates a path named saveLocation that represent the location of the file. 
    
    Based the extracted and generated strings, it will formate a filter and use 
    it to query the database. 
    
    If a tracker is found, then the file will not be tracked. If no tracker is 
    found, then server will create a tracker for the file and send the tracker 
    to the client.
*/
router.post(
  "/api/upload",
  [isAuthorize, upload.single("uploaded_file")],
  async (req, res) => {
    // Check if there is any file. req.file is undefined only if the file does
    // not go though the filter in multer.
    // accepted will be falsy if req.file is undefined, otherwise truthy
    const accepted = req.file;

    if (accepted) {
      const filename = req.file.originalname;
      const owner = req.user.email;
      const saveLocation = path.resolve(
        "..",
        "yujia-online-storage-backend",
        "storage",
        req.user.id.toString(),
        filename
      );
      const details = { filename: filename, owner: owner, path: saveLocation };

      // Check the file details against the database
      // If not tracker found, track it. Otherwise, send 400 to the client
      const results = await searchFileTrackers(details);
      if (results.length === 0) {
        const tracker = await createFileTracker(details);
        res.send(tracker);
      } else res.sendStatus(400);
    } else {
      res.sendStatus(400);
    }
  }
);

/*
  Route: /api/delete
  Method: DELETE
  Accessiblity: Protected

  Description: 
    The route handles the file deletion request from the client. 
    
    Server will check the req.body.filename, see if the client provides a 
    filename. If not provided, then send a 400 to the client. 
    
    Otherwise, the server will resolve a path based on the req.user.id, and 
    req.body.filename. 
    
    Once the path is generated, a filter that composes by req.body.filename 
    (filename), req.user.email (owner), and location (path) will be used to 
    search the given tracker. 
    
    If no tracker is returned, then send 400. If one tracker returns, delete the 
    file with the given path, and delete the tracker from the database.


*/
router.delete("/api/delete", isAuthorize, async (req, res) => {
  const filename = req.body.filename || false;

  if (!filename) {
    res.sendStatus(400);
    return;
  }

  const location = path.resolve(
    "..",
    "yujia-online-storage-backend",
    "storage",
    req.user.id,
    req.body.filename
  );

  // Before the deletion, verify if the request is valid
  // by checking with tracker database
  const result = await searchFileTrackers({
    filename: req.body.filename,
    owner: req.user.email,
    path: location,
  });

  if (result.length !== 1) return res.sendStatus(400);

  await deleteFile(location);

  deleteFileTracker({
    filename: req.body.filename,
    owner: req.user.email,
  });

  res.sendStatus(200);
});

// Update the detials of a file
/*
  Route: /api/update
  Method: PUT
  Accessiblity: Protected

  Description:
    The route handles the update file details request from the client.

    The server will extract the fileId, tags, notes from the req.body.fileId,
    req.body.updateTags, and req.body.updateNotes. Then it will query database
    if such file exists based on the fileId.

    If exists, it will check if the client is the owner of the file.
    If not, 400 will be sent. If client is, file will be deleted. Then
    the new copy of updated tracker will be returned to the client.

    If not exist, 400 will be sent.

*/
router.put("/api/update", isAuthorize, async (req, res) => {
  const fileId = req.body.fileId; // Extract file id
  const tags = req.body.updateTags; // Extract updated tags
  const notes = req.body.updateNotes; // Extract updated notes

  // Query database, then check the validaity of the request
  const tracker = await searchFileTrackers({ _id: fileId });
  const invalid = tracker[0].owner !== req.user.email;
  if (!fileId || invalid) return res.sendStatus(400);

  // Update the tracker
  const updated = await updateFileTracker(
    { _id: fileId },
    { tags: tags, notes: notes }
  );

  // Return the updated copy of tracker to the client
  if (updated) {
    const copy = await searchFileTrackers({ _id: fileId });
    const filtered = _.pick(copy[0], [
      "_id",
      "filename",
      "tags",
      "notes",
      "date",
    ]);
    res.send(filtered);
  }
});

module.exports = router;
