require("dotenv").config();

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
  res.send(htmlTemplate("<h1>It works</h1>"));
});

server.listen(PORT, (req, res) => {
  console.log('====================================================================='); 
  const consoleMessage = `Server running on port ${process.env.PORT || PORT}`;
  process.stdout.write(consoleMessage.padStart(50) + "\n");
  console.log('=====================================================================');
});