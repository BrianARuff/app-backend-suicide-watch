const jwt = require("jsonwebtoken");
const database = require("../db/pgConfig");

async function protect(req, res, next) {

  const authToken = req.header("auth-token");

  if (!authToken) {
    return res.status(401).json({ message: "Invalid header header key-value store." });

  }

  try {

    const verifiedToken = jwt.verify(authToken, process.env.JWT_SECRET);

    if (!verifiedToken) {
      return res.status(401).json({ message: "No verified token is present." });
    } else {

      const user = await database.query(`SELECT * FROM USERS WHERE users.name = $1`, [
        req.header("name")
      ]);

      if ( user.rows[0]["role"] === "admin" || user.rows[0]["role"] === "member" ) {
        return next();
      } else {
        return res.status(403).json({ message: "You do not have the proper account permissions to view members by name. Only administrators and members can do this." });
      }
    }

  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error })
  }
}

module.exports = protect;
