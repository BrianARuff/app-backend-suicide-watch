# Knex Setup MD

1. `npm i -g knex` // Make sure you install it globally, it won't work w/o it.
2. Make sure knex is also installed locally
3. `knex init`
4. `npm i dotenv` for storing and keeping env variables secret 😯
5. `require("env").config();` pulls in the .env for the file in question
6. Create a `.env` file at the top level of your app's file structure
7. Paste below code into `.env` file.
  ```
    CLIENT="pg"
    CONNECTION="postgres://localhost/sw"
  ```
8. Paste below code into `knexfile.js` file.
  ```
  require("dotenv").config();
  module.exports = {
    development: {
      client: process.env.CLIENT,
      connection:'postgres://localhost/sw',
      migrations: {
        directory: './db/migrations'
      },
      seeds: {
        directory: './db/seeds/dev'
      },
      useNullAsDefault: true
    },
    production: {
      client: 'pg',
      connection: process.env.DATABASE_URL,
      migrations: {
        directory: './db/migrations'
      }, 
      seeds: {
        directory: './db/seeds/production'
      },
      useNullAsDefault: true
    }
  }
  ```

### AFTER you have done the above and completed setting up the schema in the `db/migrations` folder
 - `knex seed:make` generates seed files for the database
 - `knex seed:run` runs the seeds on the database to populate it with dummy data.
 - `knex migrate:make` creates the initial migration file where you structure the schema of your tables.
 - `knex migrate:rollback` reverts your migrations in your DB back to the first version of the database while it was still empty and had no schema.
 - `knex migrate:latest` rolls forward from it's current place in migration order and the applies the rest of the migrations to the database.
 - `knex migrate:up` migrate 1 migration up in your current migration file.
 - `knex migrate:down` migrate down in your current migration file.