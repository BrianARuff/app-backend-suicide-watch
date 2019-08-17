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
<<<<<<< HEAD
      return res.status(404).json({ message: errors.clientSideError404, date: loggableDate, time: loggableTime });
=======
      res.status(404).json({ message: errors.clientSideError404, date: loggableDate, time: loggableTime });
>>>>>>> parent of 54b9096... Revert "working on authentication routes for /registration. I am having some issues with my POST request to create a new user in the DATABASE, but I have an open ticket on SO, so we will see how that goes. That place is hit or miss, and I fucking hate it when it's a miss because I will have to deal with some fucking ass-hole who thinks they are superior, yet they refuse to answer the question or some BS like that, fuck stack overflow, fuck them up their stupid asses (sometimes that is, no not really, I love you stack overflow, but you crazy as hell though, love you girl)."
    }

    return res.status(200).json(newUser.rows[0]);

  } catch (error) {

    return res.status(500).json({ error: error.stack, date: loggableDate, time: loggableTime });

  }
});

module.exports = router;