
require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL || process.env.PG_CONNECTION_STRING
});

client.connect();

module.exports = client;
