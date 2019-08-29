require("dotenv").config();

const express = require("express");
const server = express();

/* CORS */
const cors = require("cors");
server.options("*", cors());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// middleware
const parseMiddleWare = require("./middleWare/middleware.js");
parseMiddleWare(server);

// Home Page of API
server.get("/", (req, res) => {
  res.send("<h1>It works</h1>");
});

server.listen(process.env.PORT || 3000, (req, res) => {
  const consoleMessage = `Server running on port ${process.env.PORT || 3000}`;
  process.stdout.write("---" + consoleMessage + "---\n");
});
