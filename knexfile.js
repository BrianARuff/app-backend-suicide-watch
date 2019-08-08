require("dotenv").config();
module.exports = {
    development: {
        client: process.env.CLIENT,
        connection: 'postgres://localhost/sw',
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
};
