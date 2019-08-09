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
server.use("/api/users", userRoutes);

server.get("/", (req, res) => {
  res.send(htmlTemplate(html));
})

const html = 
`
  <div>
    <h1>Root API Page</h1>
    <ul>
      <a href="/api/users">Users Page</a>
    </ul>
  </div>
`;

server.listen(PORT, (req, res) => {
  console.log(PORT);
});