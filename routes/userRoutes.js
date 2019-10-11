const router = require("express").Router();
const database = require("../db/pgConfig");
const errors = require("../ErrorMessages/errorIndex");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");
const protectAdminScope = require("../middleWare/protectRoutesAdminScope");
// const protectMemberScope = require("../middleWare/protectRoutesMemberScope");

// GET ALL USERS LIST
router.get("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const { rows: users } = await database.query(
      "SELECT * from USERS ORDER BY users.created_at DESC"
    );
    if (users.length < 1 || !users) {
      errors.clientSideError404;
      return res.status(404).json({ users: [] });
    } else {
      return res.status(200).json({ users });
    }
  } catch (error) {
    return res.status(500).json({
      error: formatPGErrors(error),
      date: loggableDate,
      time: loggableTime
    });
  }
});

// GET USER by ID
router.get("/:id", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const { id } = req.params;
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const user = await database.query(
      "SELECT * from USERS WHERE USERS.id = $1",
      [id]
    );
    if (!user.rows[0] || !user) {
      return res.status(404).json({
        statusCode: res.statusCode,
        message: errors.clientSideError404,
        date: loggableDate,
        time: loggableTime
      });
    } else {
      return res.status(200).json(user.rows[0]);
    }
  } catch (error) {
    return res.status(500).json({
      error: formatPGErrors(error),
      date: loggableDate,
      time: loggableTime
    });
  }
});

// GET USER by NAME
router.get("/byname/:name", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const { name } = req.params;
  const date = new Date();
  const loggableDate = date.toLocaleDateString();
  const loggableTime = date.toLocaleTimeString();
  try {
    const user = await database.query("SELECT * from USERS WHERE name = $1", [
      name
    ]);
    if (!user.rows[0] || !user) {
      return res.status(404).json({
        statusCode: res.statusCode,
        message: errors.clientSideError404,
        date: loggableDate,
        time: loggableTime
      });
    } else {
      return res.status(200).json(user.rows[0]);
    }
  } catch (error) {
    return res.status(500).json({
      error: formatPGErrors(error),
      date: loggableDate,
      time: loggableTime
    });
  }
});

router.delete("/name/:name", protectAdminScope, async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.headers.authorize !== process.env.ADMIN_SECRET) {
    return res
      .status(404)
      .json({ message: "Invalid credentials for this request." })
      .end();
  }

  const { name } = req.params;

  // save user before deleting it for more precise API response messages.
  const user = await database.query(
    "SELECT * from USERS WHERE USERS.name = $1",
    [name]
  );

  try {
    // try/catch for DELETE
    await database.query("DELETE FROM USERS WHERE USERS.name = $1", [name]);

    // try/catch for verification of DELETE (user no longer in DB)
    try {
      if (!user.rows[0] || !user) {
        return res.status(401).json({
          message:
            "User was not deleted. User is still in the database. It is also possible the User was never in the database."
        });
      } else {
        return res.status(200).json({
          user: user.rows[0],
          message: "User was deleted, and is no longer in the database."
        });
      }
    } catch (error) {
      return res.status(500).json({ error: formatPGErrors(error) });
    }
  } catch (error) {
    return res.status(500).json(formatPGErrors(error));
  }
});

// router.patch("/name/:name", protectAdminScope, async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   const { name } = req.params;
//   const {
//     email,
//     password,
//     date_of_birth,
//     description,
//     image,
//     friends,
//     role
//   } = req.body;

//   const userRawData = await database.query(
//     "SELECT * FROM USERS WHERE users.name = $1",
//     [name]
//   );

//   const {
//     name: oldName,
//     email: oldEmail,
//     password: oldPassword,
//     date_of_birth: old_date_of_birth,
//     description: oldDescription,
//     image: oldImage,
//     friends: oldFriends,
//     role: oldRole
//   } = userRawData.rows[0];

//   try {
//     const updateUserRawData = await database.query(
//       "UPDATE users SET name = $1, email = $2, password = $3, date_of_birth = $4, description = $5, image = $6, friends = $7, role = $8 WHERE users.name = $9",
//       [
//         name || oldName,
//         email || oldEmail,
//         password || oldPassword,
//         date_of_birth || old_date_of_birth,
//         description || oldDescription,
//         image || oldImage,
//         JSON.stringify(friends) || JSON.stringify(oldFriends),
//         role || oldRole,
//         name
//       ]
//     );
//     return res.status(200).json({
//       message: "User information was succesfully submitted.",
//       updateUserRawData
//     });
//   } catch (error) {
//     return res.status(500).json(formatPGErrors(error));
//   }
// });

// Get user by first character in name (not case sensistive)
router.get("/startsWith/:char", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const { char } = req.params;
  try {
    const users = await database.query(
      "SELECT * FROM users WHERE LOWER(name) LIKE LOWER($1) ORDER BY users.id ASC;",
      [char[0] + "%"]
    );
    return res.status(200).json(users.rows);
  } catch (error) {
    return res.status(500).json(formatPGErrors(error));
  }
});

router.get("/articles/:id", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  const { id } = req.params;

  try {
    const articles = await database.query(
      "SELECT articles.id, title, text, author, likes, dislikes, read_time, articles.created_at, articles.updated_at, user_id, email, date_of_birth, image, role FROM articles INNER JOIN users on articles.user_id = users.id WHERE user_id = $1",
      [id]
    );

    if (!articles.rows[0] || articles.rows[0].length < 1) {
      return res.status(204).json({ articles });
    } else {
      return res.status(200).json({ articles: articles.rows });
    }
  } catch (error) {
    return res.status(500).json({
      error: formatPGErrors(error),
      message: "Failed to retreive articles."
    });
  }
});

module.exports = router;
