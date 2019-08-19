const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../db/pgConfig");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");

/*
***USERS TABLE SCHEMA***

id SERIAL NOT NULL PRIMARY KEY,

name VARCHAR(15)  NOT NULL CHECK (name <> '') UNIQUE,
email VARCHAR(255) NOT NULL CHECK (email <> '') UNIQUE,
password VARCHAR(255) NOT NULL CHECK (password <> ''),

date_of_birth date NOT NULL,

description VARCHAR(255) UNIQUE,
image TEXT,
friends JSONB,

role VARCHAR(255)  NOT NULL CHECK (role <> '') DEFAULT 'member',

created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()

*/


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
    console.error(new Error("Invalid password path:/auth/register" ))
    return res.status(404).json({message: "Invalid Password. Please try again."});
  }

  const newUser = {
    name,
    password,
    email,
    date_of_birth,
    role,
    description,
    image,
    friends: friends
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
    return res.status(200).json({ newUser })
  } catch (error) {
    res.status(500).json({ error: formatPGErrors(error), date: loggableDate, time: loggableTime });
  }
});


module.exports = router;