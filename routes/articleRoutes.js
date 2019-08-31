const router = require("express").Router();
const database = require("../db/pgConfig");
const formatPGErrors = require("../ErrorMessages/formatPGErrors");
const protectAdminScope = require("../middleWare/protectRoutesAdminScope");
const protectMemberScope = require("../middleWare/protectRoutesMemberScope");
const headers = require("../Utils/accessControlAllowHeaders");



router.get("/", async (req, res) => {
  headers().h1; // Access-Control-Allow-Origin", "*"
  headers().h2; // Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept
  try {
    const articles = await database.query("SELECT * FROM ARTICLES");
    if (!articles.rows.length < 1) {
      return res.status(403).json({ message: "No Articles Found" });
    } else {
      return res.status(200).json({ articles: articles.rows });
    }
  } catch (error) {
    return res.status(500).json(formatPGErrors(error));
  }
});

module.exports = router;
