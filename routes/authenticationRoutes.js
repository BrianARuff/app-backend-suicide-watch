require("dotenv").config();

const router = require("express").Router();
const database = require("../db/pgConfig");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenGenerator = require("../JWT/token-generator");
const uuid = require("uuid/v4");

/* REGISTER */

router.post("/register", async (req, res) => {

  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();

  const { name, email, date_of_birth, description, image, friends, role } = req.body;

  let { password } = req.body;

  if (password) {
    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(password, salt);
    password = hash;
  } else {
    console.error(new Error("Invalid password Error @ path:/auth/register"))
    return res.status(403).json({ message: "Invalid Password. Please try again." });
  }

  try {
    await database.query("INSERT into USERS ( name, password, email, date_of_birth, role, description, image, friends ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )", [
      name,
      password,
      email,
      date_of_birth,
      role,
      description,
      image,
      JSON.stringify(friends)
    ]);

    const user = {
      name,
      email,
      date_of_birth,
      role,
      description,
      image,
      friends
    }

    const token = jwt.sign(user, process.env.JWT_SECRET,
      {
        jwtid: uuid(),
        algorithm: "HS256",
        keyid: uuid(),
        expiresIn: "15m",
        noTimestamp: false,
      });

    req.session.cookie.token = token;

    return res.status(200).json({ user, token });

  } catch (error) {
    return res.status(500).json({ error: formatPGErrors(error), date: loggableDate, time: loggableTime });
  }
});

/* LOGIN */

router.post("/login", async (req, res) => {
  const { password, name, email } = req.body;
  try {
    const user = await database.query("SELECT * FROM users WHERE users.name = $1 OR users.email = $1", [
      name || email
    ]);

    const isValidPassword = await bcryptjs.compareSync(password, user.rows[0].password);


    if ((user.rows[0].name === name || user.rows[0].email === email) && isValidPassword) {


      const { name, email, date_of_birth, role, description, image, friends, created_at
      } = user.rows[0];

      const userData = {
        name,
        email,
        date_of_birth,
        role,
        description,
        image,
        friends,
        created_at
      }

      const token = jwt.sign(userData, process.env.JWT_SECRET,
        {
          jwtid: uuid(),
          algorithm: "HS256",
          keyid: uuid(),
          expiresIn: "15m",
          noTimestamp: false,
        });
  
      req.session.cookie.token = token;

      return res.status(200).json({userData, token});
    } else {
      return res.status(403).json({ message: "Invalid login credentials" });
    }
  } catch (error) {
    return res.status(500).json(formatPGErrors(error));
  }
});

module.exports = router;