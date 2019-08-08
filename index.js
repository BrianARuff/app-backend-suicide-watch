require("dotenv").config();

const express = require("express");
const server = express();
const PORT = parseInt(process.env.PORT, 10);

const middleWare = require("./middleware.js");
const userRoutes = require("./routes/userRoutes.js");

server.use(userRoutes);

server.get("/", (req, res) => {
  res.send(rootTemplateLiteral);
})

server.listen(PORT, (req, res) => {
  console.log(PORT);
});

module.exports = server;


const rootTemplateLiteral = `
  <h1>Root API</h1>
  <ul>
    <a href="/users">Users Page</a>
  </ul>
`;