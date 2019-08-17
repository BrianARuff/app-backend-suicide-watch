const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../db/pgConfig");
const errors = require("../ErrorMessages/errorIndex");

// TABLE USERS SCHEMA
//   id            serial       NOT NULL PRIMARY KEY,
//   name          varchar(15)  NOT NULL UNIQUE,
//   password      varchar(255) NOT NULL,
//   email         varchar(255) NOT NULL UNIQUE,
//   date_of_birth date         NOT NULL,
//   role          varchar(11)  NOT NULL DEFAULT 'member',
//   description   varchar(5000),
//   image         text,
//   friends       jsonb,
//   created_at    timestamptz  NOT NULL DEFAULT NOW(),
//   updated_at    timestamptz  NOT NULL DEFAULT NOW()


router.post("/register", (req, res) => {

  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();

  const { name, password, email, date_of_birth, role, description, image, friends } = req.body;

  const newUser = {
    name,
    password,
    email,
    date_of_birth,
    role,
    description,
    image,
    friends: JSON.stringify(friends)
  }

  database.query("INSERT into USERS ( name, password, email, date_of_birth, role, description, image, friends ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )", [
    name,
    password,
    email,
    date_of_birth,
    role||null,
    description||null,
    image||null,
    JSON.stringify(friends)
  ])
    .then(tableData => {
      return res.status(200).json(newUser);
    })
    .catch(error => res.status(500).json({ error: error.stack, date: loggableDate, time: loggableTime }));
});


module.exports = router;