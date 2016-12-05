'use strict';

module.exports = {
  development: {
    client: 'pg',
    // connection: 'postgres://localhost/bookshelf_dev'
    connection: process.env.DATABASE_URL
  },

  test: {
    client: 'pg',
    // connection: 'postgres://localhost/bookshelf_test'
    connection: process.env.DATABASE_URL
  },

  production: {}
};
