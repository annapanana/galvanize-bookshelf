'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex');
const boom = require('boom');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { camelizeKeys } = require('humps');

// create a token
// a token is specific to the user
// require json webtoken
// look for the sign method
// also generate a cookie

router.post('/users', (req, res, next) => {
  var hashPw;

  checkForValidEmail(req.body.email, next);
  if (!req.body.email) {
    return next(boom.create(400, 'Email must not be blank'));
  }
  if(req.body.password) {
    if (req.body.password.length < 8) {
      return next(boom.create(400, 'Password must be at least 8 characters long'));
    }
    // If the password is valid, generate hash and save data
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            hashPw = hash;
            knex('users')
              .insert({
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                hashed_password: hashPw
              }, '*')
              .then((users) => {
                var userData = camelizeKeys(users[0]);
                delete userData.hashedPassword;
                res.send(userData);
              });
        });
    });
  } else {
    return next(boom.create(400, 'Password must be at least 8 characters long'));
  }
});

function checkForValidEmail(email, next) {
  knex('users')
    .then((users) => {
      console.log(users);
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          return next(boom.create(400, 'Email already exists'));
        }
      }
    });
}

function createToken() {
  
}

module.exports = router;
