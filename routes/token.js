'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex');
const boom = require('boom');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {camelizeKeys, decamelizeKeys} = require('humps');
var authenticationStatus = false;

router.get('/token', (req, res, next) => {
    res.send(authenticationStatus);
});

// verify token

router.post('/token', (req, res, next) => {
  console.log(req.headers.authorization);
  if (!req.body.password || !req.body.username) {
    return res.sendStatus(400);
  }
  const { email, password } = req.body;
  knex('users')
  .where({username:req.body.username})
  .first()
  .then(function(result) {
    if (!result || !bcrypt.compareSync(req.body.password, result.hashed_password)) {
      // res.sendStatus(401);
    } else {
      var thisUser = result;
      delete thisUser.hashed_password;
      authenticationStatus = true;
      res.send(thisUser);

      // res.cookie(thisUser);
      // res.end();
    }
  });
});

router.delete('/token', (req, res, next) => {
  res.cookie(true);
  res.end();
})
// router.get('/favorites', (req, res, next) => {
//   knex('favorites')
//     .orderBy('id')
//     .then((favoritesSnake) => {
//       var favorites = camelizeKeys(favoritesSnake);
//       if (req.body.bookId) {
//         if (!favorites[req.body.bookId]) {
//           // console.log("book not valid");
//           return res.send(false);
//         }
//         res.send(true);
//         // res.send(favorites[req.body.bookId-1]);
//       } else {
//         res.send(favorites[0]);
//       }
//     })
//     .catch((err) => {
//       next(err);
//     });
// });
//
// router.post('/favorites', (req, res, next) => {
//   knex('favorites')
//     .insert({
//       user_id: 1,
//       book_id: req.body.bookId,
//     }, '*')
//     .then((book) => {
//       res.send(book);
//     })
//     .catch((err) => {
//       next(err);
//     });
//   // var selectedBook;
//   // knex('books')
//   //   .where('id', req.body.bookId)
//   //   .then((bookList) => {
//   //     selectedBook = bookList[0];
//   //     console.log(selectedBook);
//   //     knex('favorites')
//   //       .insert(selectedBook, '*')
//   //       .then((book) => {
//   //         res.send(book);
//   //       })
//   //       .catch((err) => {
//   //         next(err);
//   //       });
//   //   })
//   //   .catch((err) => {
//   //     next(err);
//   //   });
// });

// router.delete('/favorites', (req, res, next) => {
//   knex('favorites')
//
// })

module.exports = router;
