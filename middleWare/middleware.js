require('dotenv').config();

// helper middleware
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

// route middleware
const userRoutes = require("../routes/userRoutes");
const authenticationRoutes = require("../routes/authenticationRoutes");

module.exports = server => {
  server.use(helmet());
  server.use(cors());
  server.use(express.json());
  server.use(morgan("dev"));
  server.use("/users", userRoutes);
  server.use("/auth", authenticationRoutes);
}