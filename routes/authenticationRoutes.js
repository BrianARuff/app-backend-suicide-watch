const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../db/pgConfig");
const errors = require("../ErrorMessages/errorIndex");

// Gender options ('male', 'female', 'other');
// Role options('banned', 'suspended', 'member', 'admin', 'developer');
// id            serial       NOT NULL PRIMARY KEY,
// username      varchar(33)  NOT NULL UNIQUE,
// password      varchar(255) NOT NULL,
// date_of_birth date         NOT NULL,
// gender        genderEnum   NOT NULL,
// created_at    timestamptz  NOT NULL DEFAULT NOW(),
// updated_at    timestamptz  NOT NULL DEFAULT NOW(),
// role          roleEnum     NOT NULL DEFAULT 'member',
// description   text,
// image         jsonb,
// friends       jsonb

router.post("/register", async (req, res) => {

  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();

  const { username, password, date_of_birth, gender, role, description, image, friends } = req.body;

  console.log("\nBODY", req.body, "\n");
  console.log("FRIENDS", friends);

  try {
    const user = await database.query(`INSERT into 
    USERS (
      username, 
      password, 
      date_of_birth, 
      gender, 
      role, 
      description, 
      image, 
      friends
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
        [username],
        [password],
        [date_of_birth],
        [gender],
        [role],
        [description || null],
        [image || null],
        [friends || null]
      ]
    );

    if (!user) {
      return res.status(404).json({ message: errors.clientSideError404, date: loggableDate, time: loggableTime });
    }

    return res.status(200).json(newUser.rows[0]);

  } catch (error) {

    return res.status(500).json({ error: error.stack, date: loggableDate, time: loggableTime });

  }
});

module.exports = router;