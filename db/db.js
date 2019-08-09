require("dotenv").config();

const db = require("knex")(require("../knexfile.js")[process.env.NODE_ENV]);

module.exports = db;
