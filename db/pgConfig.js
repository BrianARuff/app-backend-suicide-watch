
require("dotenv").config();

const { Client, Pool } = require("pg");

const pool = new Pool();

const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING
});


client.connect();

module.exports = client;
