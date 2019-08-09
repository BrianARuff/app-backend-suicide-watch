const router = require("express").Router();
const db = require("../db.js");

router.get("/users", (req, res) => {
  res.send(usersTemplateLiteral)
});





module.exports = router;

const usersTemplateLiteral = `
  <h1>Users API</h1>
  <ul>
    <a href="/">Root Page</a>
  </ul>
`;