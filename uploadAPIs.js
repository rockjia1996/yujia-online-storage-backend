const express = require("express");
const multer = require("multer");

// Configure the rules for saving location and names
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

router.post("/api/upload", upload.single("upload-file"), (req, res) => {});

module.exports = router;
