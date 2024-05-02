// knex is necessary for bookshelf to work

const knex = require('knex')(
    {
        // client refers to what database technology we are using
        client: 'mysql',
        connection: {
            user: "superadmin",
            password: "admin1234",
            database: "superfoods",
            host: "127.0.0.1"
        }
    }
);

// create bookshelf
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;

