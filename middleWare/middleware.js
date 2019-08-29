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
  name: "authentication-token",
  resave: true,
  cookie: {
    maxAge: 1000*60*15,
    httpOnly: false
  },
  genid: function(req) {
    return uuid();
  },
  saveUninitialized: true
}

module.exports = server => {
  server.use(helmet());
  process.env.NODE_ENV === "development" ? server.use(morgan("dev")) : null;
  server.use(express.json());
  server.use(session(sessionConfiguration));
  server.use("/users", userRoutes);
  server.use("/auth", authenticationRoutes);
  server.use("/thanos", thanosRoute);
}