const express = require("express");
const multer = require("multer");
const trackingHandler = require("./trackingHandler");

const isAuth = (req, res, next) => {
  const valid = req.session.isAuth;
  if (valid) next();
  else res.sendStatus(401);
};

/*
  Configure a storage engine to save file in a specific location
 
    destination: the location that file will be storeage (the folder)
    filename: the filename that will be used while storing

*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.session.username);
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
  isAuth,
  upload.single("upload-file"),
  async (req, res) => {
    const filename = req.file.originalname;
    const owner = req.session.username;
    const path = req.file.path;

    console.log("filename: " + filename);
    console.log("owner: " + owner);
    console.log("path:  " + path);

    await trackingHandler.createTracker(filename, owner, path);

    //res.setHeader("Content-Type", "application/json");
    //res.send({ data: "success" });
    res.sendStatus(200);
  }
);

router.get("/api/upload/file-list", async (req, res) => {
  // get the file list from database

  const filenames = await trackingHandler.findUserFiles(req.session.username);

  let names = filenames.map((item) => {
    return item.filename;
  });

  names = names.join("/");
  console.log(names);
  res.set("Content-Type", "text/plain");
  res.send(names);
});

module.exports = router;
