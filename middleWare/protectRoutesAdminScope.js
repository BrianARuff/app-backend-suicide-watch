const jwt = require("jsonwebtoken");
const database = require("../db/pgConfig");

async function protect(req, res, next) {

  const authToken = req.header("auth-token");

  if (!authToken) {
    return res.status(401).json({ message: "Invalid header key-value store." });

  }

  try {

    const verifiedToken = jwt.verify(authToken, process.env.JWT_SECRET);

    if (!verifiedToken) {
      return res.status(401).json({ message: "No verified token is present." });
    } else {

      const user = await database.query(`SELECT * FROM USERS WHERE users.name = $1`, [
        req.header("name")
      ]);

      if (!user || user.rows[0]["role"] !== "admin") {
        return res.status(403).json({ message: "You do not have the proper account permissions to view members by name. Only administrators can do this." });
      } else {
        return next();
      }
    }

  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error })
  }
}

module.exports = protect;
