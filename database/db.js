require("dotenv").config();
module.exports = require("knex")(require("../knexfile.js")[process.env.NODE_ENV]);
