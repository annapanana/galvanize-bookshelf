'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex');
const boom = require('boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const {camelizeKeys, decamelizeKeys} = require('humps');
var authenticationStatus = false;

router.get('/token', (req, res, next) => {
    res.send(authenticationStatus);
});

router.post('/token', (req, res, next) => {

  // if (!req.body.password || !req.body.email) {
  //   return res.sendStatus(400);
  // }

  const { email, password } = req.body;
  knex('users')
  .where({email:req.body.email})
  .first()
  .then(function(result) {

    if (!result || !bcrypt.compareSync(req.body.password, result.hashed_password)) {
      return next(boom.create(400, "Bad email or password"));
    } else {

      authenticationStatus = true;
      var validUser = {
        id: result.id, /// the the id from users
        firstName: result.first_name,
        lastName: result.last_name,
        email: result.email
      };
      let token = jwt.sign(validUser, process.env.JWT_SECRET);
      // 3 hours from now
      let expirationTime = new Date(Date.now() + 1000 * 60 * 60 * 3);
      res.cookie('token', token, {
        httpOnly: true,
        expires: expirationTime,
        secure: router.get('env') === 'production'
      });

      jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
        res.send(validUser);
      });
    }
  })
  .catch((err) => {
    next(err);
  });
});

router.delete('/token', (req, res) => {
  res.clearCookie('token');
  res.send(true);
});

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
