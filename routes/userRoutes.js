const router = require("express").Router();
const database = require("../db/pgConfig");
const errors = require("../ErrorMessages/errorIndex");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");
const protectAdminScope = require("../middleWare/protectRoutesAdminScope");
const protectMemberScope = require("../middleWare/protectRoutesMemberScope");

// GET ALL USERS LIST
router.get("/", async (req, res) => {
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const { rows: users } = await database.query("SELECT * from USERS;");
    if (users.length < 1 || !users) {
      errors.clientSideError404;
      return res.status(404).json({ users: [] });
    } else {
      return res.status(200).json({ users });
    }
  } catch (error) {
    return res.status(500).json({ error: formatPGErrors(error), date: loggableDate, time: loggableTime });
  }
});

// GET USER by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const user = await database.query("SELECT * from USERS WHERE USERS.id = $1", [id]);
    if (!user.rows[0] || !user) {
      return res.status(404).json({ statusCode: res.statusCode, message: errors.clientSideError404, date: loggableDate, time: loggableTime });
    } else {
      return res.status(200).json(user.rows[0]);
    }
  } catch (error) {
    return res.status(500).json({ error: formatPGErrors(error), date: loggableDate, time: loggableTime });
  }
});

// GET USER by NAME
router.get("/name/:name", protectMemberScope, async (req, res) => {
  const { name } = req.params;
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const user = await database.query("SELECT * from USERS WHERE USERS.name = $1", [name]);
    if (!user.rows[0] || !user) {
      return res.status(404).json({ statusCode: res.statusCode, message: errors.clientSideError404, date: loggableDate, time: loggableTime });
    } else {
      return res.status(200).json(user.rows[0]);
    }
  } catch (error) {
    return res.status(500).json({ error: formatPGErrors(error.stack), message: errors.serverSideErrorMessage500, date: loggableDate, time: loggableTime });
  }
});

router.delete("/name/:name", protectAdminScope, async (req, res) => {
  const { name } = req.params;
  
  // save user before deleting it for more precise API response messages.
  const user = await database.query("SELECT * from USERS WHERE USERS.name = $1", [name]);
  
  try {
    // try/catch for DELETE
    await database.query(
      "DELETE FROM USERS WHERE USERS.name = $1", [
        name
      ]
    );

    // try/catch for verification of DELETE (user no longer in DB)
    try {
      if (!user.rows[0] || !user) {
        return res.status(401).json({ message: "User was not deleted. User is still in the database. It is also possible the User was never in the database." });
      } else {
        return res.status(200).json({ user: user.rows[0], message: "User was deleted, and is no longer in the database." });
      }
    } catch (error) {
      return res.status(500).json({ error: formatPGErrors(error) });
    }

  } catch (error) {
    return res.status(500).json(formatPGErrors(error));
  }
});

module.exports = router;
