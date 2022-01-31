const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const upload = require("./uploadAPIs");
const logger = require("./loginAPIs");
const register = require("./registerAPIs");

const server = express();
const port = process.env.PORT || 3333;

// Save the session into MongoDB with connect-mongodb-session package
// Learn More: https://github.com/mongodb-js/connect-mongodb-session
let store = new MongoDBStore({
  uri: "mongodb://localhost:27017/connect_mongodb_session_test",
  collection: "mySessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

/*
  Adding a session middleware from express-session.
  
    secret: a key that assigns the cookie
    resave: save the same one
    saveUninitialized: save the uninitialized

  Note:
    The middleware should be used before any subsequent 
    middleware that requires it to function.

    In this case, upload, and logger.
*/
server.use(
  session({
    secret: "keyboard cat",
    cookie: {
      maxAge: 1000 * 60 * 5, // 1000 * 60 * 60 * 24,
    },
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Parse the body of the request into a json object
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Serve the static files (css, js, image, etc)
server.use(express.static("public"));

// Three routers that handle upload, login, and register.
server.use(upload);
server.use(logger);
server.use(register);

/*
  Middleware isAuth()

  Customized middleware function that check if a client
  connection has been authenticated.

  If client has been authenticated, then direct the client to 
  next middleware.

  If client hasn't been authenticated, then they will be 
  redirected to login page

*/
const isAuth = (req, res, next) => {
  const valid = req.session.isAuth;
  if (valid) next();
  else res.redirect("/login");
};

// Homepage route
server.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Login page route
server.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

// Register page route
server.get("/register", (req, res) => {
  res.sendFile(__dirname + "/views/register.html");
});

/*
  Upload page route

  Adding the customized middleware to protect
  the /upload route.
*/
server.get("/upload", isAuth, (req, res) => {
  res.sendFile(__dirname + "/views/upload.html");
});

server.listen(port, () => {
  console.log(`Link:  http://localhost:${port}/`);
});
