const multer = require("multer");
const express = require("express");

const server = express();
const port = process.env.PORT || 3333;

// Configure the rules for saving location and names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

server.use(express.static("public"));

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

// Upload API
server.post("/api/upload", upload.single("upload-file"), (req, res) => {
  console.log(req.file);
  res.send("Route: /api/upload");
});

server.listen("3333", () => {
  console.log(`Link:  http://localhost:${port}/`);
});
