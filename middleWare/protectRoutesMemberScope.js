require("dotenv").config();
const database = require("../db/pgConfig");

async function protect(req, res, next) {

    try {
      const user = await database.query(`SELECT * FROM USERS WHERE users.name = $1`, [
        req.header("name")
      ]);

      if ( user.rows[0]["role"] === "admin" || user.rows[0]["role"] === "member" ) {
        return next();
      } else {
        return res.status(403).json({ message: "You do not have the proper account permissions to view members by name. Only administrators and members can do this." });
      }
    } catch (err) {
      return res.status(500).json({message: "Invalid DB login attempt!"});
    }
}

module.exports = protect;
