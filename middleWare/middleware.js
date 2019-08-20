require("dotenv").config();

// helper middleware
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");

// route middleware
const userRoutes = require("../routes/userRoutes");
const authenticationRoutes = require("../routes/authenticationRoutes");

const sessionConfiguration = {
  secret: process.env.JWT_SECRET,
  name: "auth-token",
  resave: false,
  cookie: {
    secure: false,
    maxAge: 604800000,
    httpOnly: true
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
}