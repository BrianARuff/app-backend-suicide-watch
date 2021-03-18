require("dotenv").config();

// helper middleware
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const uuid = require("uuid/v4");
const bodyParser = require("body-parser");
const cors = require("cors");

// route middleware
const userRoutes = require("../routes/userRoutes");
const authenticationRoutes = require("../routes/authenticationRoutes");
// const thanosRoute = require("../routes/thanos-x2-Route");
const articleRoutes = require("../routes/articleRoutes.js");
const commentRoutes = require("../routes/commentRoutes.js");

const sessionConfiguration = {
  secret: process.env.JWT_SECRET,
  name: "authentication-token",
  resave: true,
  cookie: {
    maxAge: 1000 * 60 * 15,
    httpOnly: false
  },
  genid: function(req) {
    return uuid();
  },
  saveUninitialized: true
};



module.exports = server => {
  server.use(cors());
  server.use(bodyParser.json({ limit: "10mb" }));
  server.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  server.use(helmet());
  server.use(express.json());
  // server.use(session(sessionConfiguration));
  server.use("/users", userRoutes);
  server.use("/auth", authenticationRoutes);
  server.use("/articles", articleRoutes);
  server.use("/comments", commentRoutes);
  // server.use("/thanos", thanosRoute);
  process.env.NODE_ENV === "development" ? server.use(morgan("dev")) : null;
};
