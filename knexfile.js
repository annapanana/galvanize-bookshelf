'use strict';

module.exports = {
  development: {
    client: 'pg',
    pool: { min: 1, max: 7 },
    // connection: 'postgres://localhost/bookshelf_dev'
    connection: process.env.DATABASE_URL
  },

  test: {
    client: 'pg',
    pool: { min: 1, max: 7 },
    // connection: 'postgres://localhost/bookshelf_test'
    connection: process.env.DATABASE_URL
  },

  production: {}
};
