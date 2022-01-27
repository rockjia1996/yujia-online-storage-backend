const express = require("express");
const multer = require("multer");

/*
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
router.post("/api/upload", upload.single("upload-file"), (req, res) => {
  console.log(req.body);
  res.setHeader("Content-Type", "application/json");
  res.send({ data: "success" });
});

module.exports = router;
