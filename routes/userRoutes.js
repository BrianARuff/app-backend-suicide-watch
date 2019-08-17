const router = require("express").Router();
const database = require("../db/pgConfig");
const errors = require("../ErrorMessages/errorIndex");

// GET ALL USERS LIST
router.get("/", async (req, res) => {
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const { rows: users } = await database.query(process.env.GET_ALL_USERS);
    if (users.length < 1) {
      errors.clientSideError404;
      return res.status(404).json({ error: error.stack, message: errors.clientSideError404, date: loggableDate, time: loggableTime });
    } else {
      return res.status(200).json({ users });
    }
  } catch (error) {
    return res.status(500).json({ error: error.stack, message: error.serverSideErrorMessage500, date: loggableDate, time: loggableTime });
  }
});

// GET USER by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params.id);
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const user = await database.query(process.env.GET_SINGLE_USER, [id]);
    if (!user.rows[0]) {
      return res.status(404).json({ statusCode: res.statusCode, message: errors.clientSideError404, date: loggableDate, time: loggableTime });
    } else {
      return res.status(200).json(user.rows[0]);
    }
  } catch (error) {
    return res.status(500).json({ error: error.stack, message: errors.serverSideErrorMessage500, date: loggableDate, time: loggableTime });
  }
});

module.exports = router;
