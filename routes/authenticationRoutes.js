require("dotenv").config();

const router = require("express").Router();
const database = require("../db/pgConfig");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenGenerator = require("../JWT/token-generator");
const uuid = require("uuid/v4");

//==============================
/*==========REGISTER==========*/
// ==============================
router.post("/register", async (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();

  const { name, email, date_of_birth, description, image, friends, role } = req.body;

  let { password } = req.body;

  const isValidEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email)

  if (!isValidEmail) {
    return res.status(403).json({message: "Invalid email"});
  }

  // TODO send proper message when name/email is already in use than what we have now...

  // Extra protection from adding Admin Users
  if (role === "admin") {
    if (req.header("admin-secret") !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid credientials to create admin accounts" })
    }
  }

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
      friends
    }

    Object.freeze(user); // protect user object...

    const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET, process.env.JWT_PUBLIC, {
      algorithm: 'HS256', keyid: uuid(), noTimestamp: false,
      expiresIn: '2m', notBefore: '2s'
    })

    let token2;
    const token = tokenGenerator.sign(user);

    setTimeout(function () {
      token2 = tokenGenerator.refresh(user);
      console.log("OLD", jwt.decode(token, { complete: true }));
      console.log("NEW", jwt.decode(token2, { complete: true }));
    }, 3000)

    // res.cookie("authentication-token", token);

    return res.status(200).json({ user, token });

  } catch (error) {
    return res.status(500).json({ error: formatPGErrors(error), date: loggableDate, time: loggableTime });
  }
});

// ==============================
/* ========== LOGIN ========== */
// ==============================
router.post("/login", async (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const { password, name, email } = req.body;
  try {
    const user = await database.query("SELECT * FROM users WHERE users.name = $1 OR users.email = $1", [
      name || email
    ]);

    Object.freeze(user.rows[0]); // protect user object...

    if (!user.rows[0]) {
      return res.status(403).json({ message: "Invalid login credentials." });
    }

    const isValidPassword = await bcryptjs.compareSync(password, user.rows[0].password);

    console.log(isValidPassword)


    if ((user.rows[0].name === name || user.rows[0].email === email) && isValidPassword) {


      const { name, email, date_of_birth, role, description, image, friends, created_at
      } = user.rows[0];

      const userData = {
        name,
        email,
        date_of_birth,
        role,
        description,
        friends,
        created_at
      }

      Object.freeze(userData); // protect userData...

      const tokenGenerator = new TokenGenerator(process.env.JWT_SECRET, process.env.JWT_PUBLIC, {
        algorithm: 'HS256', keyid: uuid(), noTimestamp: false,
        expiresIn: '2m', notBefore: '2s'
      })

      let token2;
      const token = tokenGenerator.sign(userData);

      setTimeout(function () {
        token2 = tokenGenerator.refresh(userData);
        console.log("OLD", jwt.decode(token, { complete: true }));
        console.log("NEW", jwt.decode(token2, { complete: true }));
      }, 3000)

      // res.cookie("authentication-token", token);

      return res.status(200).json({ userData, token });

    } else {
      return res.status(403).json({ message: "Invalid login credentials" });
    }
  } catch (error) {
    return res.status(500).json(formatPGErrors(error));
  }
});

module.exports = router;