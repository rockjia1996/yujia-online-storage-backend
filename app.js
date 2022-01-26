const express = require("express");
const upload = require("./uploadAPIs");

const server = express();
const port = process.env.PORT || 3333;

server.use(express.static("public"));
server.use("/api/upload", upload);

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

/*
// Upload API
server.post("/api/upload", upload.single("upload-file"), (req, res) => {
  console.log(req.file);
  res.send("Route: /api/upload");
});
*/

server.listen("3333", () => {
  console.log(`Link:  http://localhost:${port}/`);
});
