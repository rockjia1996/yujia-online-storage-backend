const express = require("express");
const cors = require('cors');
const server = express();

server.use(cors());
server.use(express.json());

const register = require("./controllers/registerAPIs");
const login = require("./controllers/loginAPIs");
const storage = require("./controllers/storageAPIs");

// Middlewares (Routers)
server.use(register); // register route
server.use(login); // login route
server.use(storage); // storage application route

const port = process.env.PORT || 7777;
server.listen(port, () => console.log(`Link: http://localhost:${port}`));
