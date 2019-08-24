const router = require("express").Router();
const formatPGErrors = require("../ErrorMessages/formatPGErrors.js");
const database = require("../db/pgConfig");

router.post("/", async (req, res) => {
  try {
    await database.query("TRUNCATE users CASCADE;");
    return res.status(200).json({ message: "Users table has been truncated and cascaded." })
  } catch (error) {
    return res.status(500).json(formatPGErrors(error));
  }
});

module.exports = router;