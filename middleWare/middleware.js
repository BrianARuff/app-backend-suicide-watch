require("dotenv").config();

// helper middleware
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const uuid = require("uuid/v4");

// route middleware
const userRoutes = require("../routes/userRoutes");
const authenticationRoutes = require("../routes/authenticationRoutes");
const thanosRoute = require("../routes/thanos-x2-Route");

const sessionConfiguration = {
  secret: process.env.JWT_SECRET,
  name: "auth-token",
  resave: true,
  cookie: {
    secure: true,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  },
  genid: function(req) {
    return uuid
  },
  saveUninitialized: true
}

module.exports = server => {
  server.use(helmet());
  server.use(cors());
  server.use(express.json());
  server.use(morgan("dev"));
  server.use(session(sessionConfiguration));
  server.use("/users", userRoutes);
  server.use("/auth", authenticationRoutes);
  server.use("/thanos", thanosRoute);
}