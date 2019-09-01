const router = require("express").Router();
const database = require("../db/pgConfig");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");
const protectAdminScope = require("../middleWare/protectRoutesAdminScope");
const protectMemberScope = require("../middleWare/protectRoutesMemberScope");



router.get("/", async (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  try {
    const articles = await database.query("SELECT * FROM ARTICLES ORDER BY id DESC");
    if (!articles.rows[0] || !articles.rows[0].length < 1) {
      return res.status(403).json({ message: "No Articles Found" });
    } else {
      return res.status(200).json({ articles: articles.rows });
    }
  } catch (error) {
    return res.status(500).json(formatPGErrors(error));
  }
});

router.post("/", async (req, res) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  const { title, text, author, likes, dislikes, read_time, created_at, updated_at, user_id } = req.body;
  
  if (title.length < 10 || text.length < 50) {
    return res.status(403).json({message: "Title must be at least 10 characters long, and its content must be at least 50 characters long."});
  } // quality content via minimum length...

  try {
    await database.query("INSERT INTO ARTICLES (title, text, author, user_id) VALUES ($1, $2, $3, $4)", [
      title,
      text,
      author,
      user_id
    ]);
  } catch (error) {
    return res.status(500).json({error: formatPGErrors(error), message: "Failed to POST new ARTICLE"}); // server error 500
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
  }
  
  if (!newArticle && Object.keys(newArticle).length !== 9) {
    return res.status(403).json({message: "Failed to POST new Article due to invalid article properties"}); // invalid article
  } else {
    return res.status(200).json(newArticle); // success
  }
});

module.exports = router;
