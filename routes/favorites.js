'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const boom = require('boom');
const {camelizeKeys, decamelizeKeys} = require('humps');
const jwt = require('jsonwebtoken');

// YOUR CODE HERE
router.get('/favorites', (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }
    knex('favorites')
      .innerJoin('books', 'books.id', 'favorites.book_id')
      .where('favorites.user_id', decoded.id)
      .then((rows) => {
        res.send(camelizeKeys(rows));
      })
      .catch((err) => {
        next(err);
      });
  });
});

router.get('/favorites/check', (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }
    // if (!Number.isInteger(req.query.bookId)) {
    //   return next(boom.create(400, 'Bad Request'))
    // }

    knex('favorites')
      .where({book_id:req.query.bookId})
      .then((row) => {
        if(row.length > 0) {
          res.send(true);
        } else {
          res.send(false);
        }
      })
      .catch((err) => {
        next(err);
      });
  });
});

router.post('/favorites', (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }
    knex('favorites')
      .insert({
        book_id: req.body.bookId,
        user_id: decoded.id
      }, "*")
      .then((books) => {
        res.send(camelizeKeys(books[0]));
      })
      .catch((err) => {
        next(err);
      });
  });
});

router.delete('/favorites', (req, res, next) => {
  let book;
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }
  });
  knex('favorites')
    .where('book_id', req.body.bookId)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }
      book = camelizeKeys(row);
      return knex('favorites')
        .del()
        .where('id', req.body.bookId);
    })
    .then(() => {
      delete book.id;
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
