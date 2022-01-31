const express = require("express");
const fs = require("fs");
const multer = require("multer");
const trackingHandler = require("./trackingHandler");

/*
  isSessionTimeout

  A customized middleware function that checks if the session
  time is out by checking the isAuth property in the
  req.session. Since users have a limited time of session time
  this middleware prevents them to upload any new file once their
  session time is out. It will send a response code 401 to user
  if their session time are out. Otherwise it will call the next()
  and move on.

*/

const isSessionTimeout = (req, res, next) => {
  const valid = req.session.isAuth;
  if (valid) next();
  else res.sendStatus(401);
};

/*
  storage

  Configure a storage engine to save file in a specific location
 
    destination: the location that file will be storeage (the folder)
    filename: the filename that will be used while storing

*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `upload/${req.session.username}`);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Initialize a router object
const router = express.Router();
const upload = multer({ storage: storage });

// The route handles the user uploaded file.
router.post(
  "/api/upload",
  isSessionTimeout,
  upload.single("upload-file"),
  async (req, res) => {
    const filename = req.file.originalname;
    const owner = req.session.username;
    const path = req.file.path;

    await trackingHandler.createTracker(filename, owner, path);
    res.send("ok");
  }
);

// The route handles the list of the uploaded file from users
router.get("/api/upload/file-list", isSessionTimeout, async (req, res) => {
  const filenames = await trackingHandler.findUserFiles(req.session.username);

  let names = filenames.map((item) => {
    return item.filename;
  });

  res.json({ filenames: names });
  //res.set("Content-Type", "text/plain");
  //console.log(res.json());
  //res.send(names);
});

// The route handles the deletion of the file
router.delete(
  "/api/upload/delete/:filename",
  isSessionTimeout,
  async (req, res) => {
    const filename = req.params.filename;
    await trackingHandler.deleteTracker(filename, req.session.username);
    fs.unlink(`upload/${req.session.username}/${filename}`, (err) => {
      if (err) console.log(err);
    });
  }
);

// The route handles the download file
router.get("/api/upload/download/:filename", async (req, res) => {
  const filename = req.params.filename;

  // Have to set Content-Disposition to attachment
  // Otherwise the broswers will attempt to open it in a window
  res.set("Content-Disposition", "attachment");
  res.sendFile(__dirname + `/upload/${req.session.username}/${filename}`);
});

module.exports = router;
