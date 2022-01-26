const express = require("express");
const upload = require("./uploadAPIs");
const logger = require("./loggerAPIs");

const server = express();
const port = process.env.PORT || 3333;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use("/api/upload", upload);
server.use("/api/validate", logger);

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen("3333", () => {
  console.log(`Link:  http://localhost:${port}/`);
});
