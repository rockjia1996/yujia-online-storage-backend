const express = require("express");
const session = require("express-session");
const upload = require("./uploadAPIs");
const logger = require("./loggerAPIs");

const server = express();
const port = process.env.PORT || 3333;
server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(upload);
server.use(logger);

const isAuth = (req, res, next) => {
  const valid = req.session.isAuth;
  if (valid) next();
  else res.redirect("/login");
};

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

server.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

server.get("/upload", isAuth, (req, res) => {
  res.sendFile(__dirname + "/views/upload.html");
});

server.listen("3333", () => {
  console.log(`Link:  http://localhost:${port}/`);
});
