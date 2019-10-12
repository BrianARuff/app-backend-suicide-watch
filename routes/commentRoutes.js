const router = require("express").Router();
const database = require("../db/pgConfig");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");

// GET comments for an article by article ID
router.get("/article/:id", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const { id } = req.params;
  try {
    const comments = await database.query(
      "SELECT comments.author, comments.text, comments.author_id, comments.article_id, comments.likes, comments.dislikes, comments.created_at, comments.updated_at FROM comments inner join articles on articles.id = comments.article_id where comments.article_id = $1",
      [id]
    );
    if (!comments) {
      res
        .status(403)
        .json({ message: "No comments found or error with request" })
        .end();
    } else {
      res
        .status(200)
        .json({ comments: comments.rows })
        .end();
    }
  } catch (error) {
    res.status(500).json(formatPGErrors(error));
  }
});

// POST a new comment using author, text, author_id, and article_id
router.post("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const { author, text, author_id, article_id } = req.body;

  try {
    const comment = await database.query(
      "INSERT INTO comments (author, text, author_id, article_id) VALUES ($1, $2, $3, $4);",
      [author, text, author_id, article_id]
    );
    if (!comment) {
      res
        .status(403)
        .json({ message: "Comment failed to post" })
        .end();
    } else {
      res.status(200).json({
        comment: comment.rows[0],
        message: "Comment was successfully posted."
      });
    }
  } catch (error) {
    res
      .status(500)
      .json(formatPGErrors(error))
      .end();
  }
});

// all comments in existance
router.get("/all", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  const comments = await database.query("select * from comments");
  if (!comments) {
    res
      .status(500)
      .json({ message: "No comments" })
      .end();
  } else {
    res
      .status(200)
      .json({ comments: comments.rows })
      .end(0);
  }
});

module.exports = router;
