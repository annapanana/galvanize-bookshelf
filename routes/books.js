'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex');
const boom = require('boom');
const {camelizeKeys, decamelizeKeys } = require('humps');

router.get('/books', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((bookSnake) => {
      var books = camelizeKeys(bookSnake);
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        return next(boom.create(400, 'book is not valid'));
      }
      book = camelizeKeys(book);
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl
    }, '*')
    .then((books) => {
      books[0] = camelizeKeys(books[0]);
      res.send(books[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  return knex('books')
    .where('id', req.params.id)
    .update({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.coverUrl }, '*') // select for only the things it wants
    .then(function(book) {
      if (!book) {
        return next(boom.create(400, 'book is not valid'));
      }
      book[0] = camelizeKeys(book[0]);
      res.json(book[0]);
    })
    .catch(function(err) {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  let book;

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next(); //what does next do here?
      }

      book = camelizeKeys(row);
      // delete book
      return knex('books')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete book.created_at; //what does delete do here? remove object properties
      delete book.updated_at;
      delete book.id;
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
