require("dotenv").config();
const serveStatic = require("./node_modules/")

const express = require("express");
const server = express();
const PORT = parseInt(process.env.PORT, 10);

// html template function
const htmlTemplate = require("./htmlTemplate.js");

// middleware
const parseMiddleWare = require("./middleWare/middleware.js");
parseMiddleWare(server);

// routes
const userRoutes = require("./routes/userRoutes.js");
server.use("/users", userRoutes);

server.get("/", (req, res) => {
  res.send(htmlTemplate(html));
});

server.listen(PORT, (req, res) => {
  console.log(PORT);
});

