const router = require("express").Router();
const database = require("../db/pgConfig");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");
const protectAdminScope = require("../middleWare/protectRoutesAdminScope");
const protectMemberScope = require("../middleWare/protectRoutesMemberScope");

(() => {
  router.get("/", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    const { limit = "20", offset = "0" } = req.query;

    try {
      const articles = await database.query(
        "SELECT * FROM ARTICLES ORDER BY id DESC limit $1 offset $2",
        [limit, offset]
      );
      if (!articles.rows[0] || !articles.rows[0].length < 1) {
        return res.status(403).json({ message: "No Articles Found" });
      } else {
        return res.status(200).json({ articles: articles.rows });
      }
    } catch (error) {
      return res.status(500).json(formatPGErrors(error));
    }
  });

  // GET user by ID
  router.get("/:id", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    const { id } = req.params;

    try {
      const article = await database.query(
        "SELECT * FROM ARTICLES WHERE ARTICLES.id = $1",
        [id]
      );

      if (!article) {
        return res.status(403).json({ message: "No article" });
      } else {
        return res.status(200).json({ article: article.rows[0] });
      }
    } catch (error) {
      return res.status(500).json(formatPGErrors(error));
    }
  });

  router.post("/", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    const {
      title,
      text,
      author,
      likes,
      dislikes,
      read_time,
      created_at,
      updated_at,
      user_id
    } = req.body;

    if (title.length < 10 || text.length < 50 || !title) {
      return res.status(403).json({
        message:
          "Title must be at least 10 characters long, and its content must be at least 50 characters long."
      });
    } // quality content via minimum length...

    try {
      await database.query(
        "INSERT INTO ARTICLES (title, text, author, user_id) VALUES ($1, $2, $3, $4)",
        [title, text, author, user_id]
      );
    } catch (error) {
      return res.status(500).json({
        error: formatPGErrors(error),
        message: "Failed to POST new ARTICLE"
      }); // server error 500
    }

    const newArticle = {
      title,
      text,
      author,
      likes: likes || 0,
      dislikes: dislikes || 0,
      read_time: read_time || 0,
      created_at,
      updated_at,
      user_id
    };

    if (!newArticle && Object.keys(newArticle).length !== 9) {
      return res.status(403).json({
        message: "Failed to POST new Article due to invalid article properties"
      }); // invalid article
    } else {
      return res.status(200).json(newArticle); // success
    }
  });

  // Update likes
  router.patch("/:id/like", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    const { id } = req.params;
    try {
      await database.query(
        "UPDATE articles set likes = likes + 1 where articles.id = $1",
        [id]
      );
      const article = await database.query(
        "select * from articles where articles.id = $1",
        [id]
      );
      const { dislikes, likes } = article.rows[0];
      return res.status(200).json({
        message: `Updated Dislikes + 1 and is now totaling ${dislikes} dislikes and ${likes} likes`
      });
    } catch (error) {
      return res.status(500).json(formatPGErrors(error));
    }
  });

  // Update dislikes
  router.patch("/:id/dislike", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    const { id } = req.params;
    try {
      await database.query(
        "UPDATE articles set dislikes = dislikes + 1 where articles.id = $1",
        [id]
      );
      const article = await database.query(
        "select * from articles where articles.id = $1",
        [id]
      );
      const { dislikes, likes } = article.rows[0];
      return res.status(200).json({
        message: `Updated Dislikes + 1 and is now totaling ${dislikes} dislikes and ${likes} likes`
      });
    } catch (error) {
      return res.status(500).json(formatPGErrors(error));
    }
  });

  // Update your own post content
  router.patch("/:id/edit", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    const { text, title } = req.body;
    const { id } = req.params;

    try {
      await database.query(
        "UPDATE articles set (text, title) = ($1, $2) where articles.id = $3;",
        [text, title, id]
      );
      return res
        .status(200)
        .json({ message: "Content updated" })
        .end();
    } catch (error) {
      return res
        .status(500)
        .json(formatPGErrors(error))
        .end();
    }
  });

  module.exports = router;
})();
