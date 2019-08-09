const router = require("express").Router();
const db = require("../db/db.js");

router.get("/", (req, res) => {
  db.raw(
    `
      SELECT * FROM USERS;
    `
  )
  .then((user) => res.status(200).send(user.rows))
  .catch(error => res.status(500).send(new Error(error)));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.raw(
    `
      SELECT * FROM USERS
      WHERE ID = ?;
    `,
    [id]
  )
    .then((user) => res.status(200).send(user.rows[0]))
    .catch(error => res.status(500).send(new Error(error)));
})

module.exports = router;