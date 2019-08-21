require("dotenv").config();
const router = require("express").Router();
const database = require("../db/pgConfig");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenGenerator = require("../JWT/token-generator");
const axios = require("axios");
const uuid = require("uuid/v4");

router.post("/register", async (req, res) => {

  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();

  const { name, email, date_of_birth, description, image, friends, role } = req.body;

  let { password } = req.body;

  if (password) {
    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(password, salt);
    await (password = hash);
  } else {
    console.error(new Error("Invalid password path:/auth/register"))
    return res.status(404).json({ message: "Invalid Password. Please try again." });
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

    const tokenGenerator = new TokenGenerator (
      process.env.JWT_SECRET,
      process.env.JWT_PUBLIC,
      {
        algorithm: "HS256",
        keyid: uuid(),
        expiresIn: "7d",
        noTimestamp: false,
      }
    );

    const token = tokenGenerator.sign(
      user,
      {
        jwtid: uuid(),
        algorithm: "HS256",
        keyid: uuid(),
        expiresIn: "15m",
        noTimestamp: false,
      }
    );

    let token2;

    setTimeout(() => {
      token2 = tokenGenerator.refresh(
        token,
        {
          jwtid: uuid(),
        }
      );
      console.log(jwt.decode(token, { complete: true }));
      console.log(jwt.decode(token2, { complete: true }));
    }, 900000)


    req.session.cookie.token = token;

    return res.status(200).json({ user, token });

  } catch (error) {
    res.status(500).json({ error: formatPGErrors(error), date: loggableDate, time: loggableTime });
  }
});


module.exports = router;