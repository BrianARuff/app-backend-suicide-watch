require('dotenv').config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

// const session = require("express-session");
// const sessionConfig = {
//   secret: process.env.JWT_KEY,
//   name: "token",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,
//     maxAge: 1000 * 60 * 60,
//     httpOnly: true
//   }
// };

module.exports = server => {
  server.use(helmet()); // use helmet as early as possible with MW
  server.use(morgan("dev"));
  server.use(cors());
  server.use(express.json());
  // server.use(session(sessionConfig));
}