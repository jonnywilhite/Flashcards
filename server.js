"use strict";

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); //hashing passwords
const bodyParser = require('body-parser'); //still not sure what this does
const methodOverride = require('method-override'); //or this
const morgan = require('morgan'); //logging
const path = require('path'); //could probably do without this
const session = require('client-sessions'); //cookies

//Model classes
const User = require('./model/user-model');
const Flashcard = require('./model/flashcard-model');

const app = express();

mongoose.connect('mongodb://localhost:27017/flashcards');

app.use(express.static('public')); //lets you serve static files
app.use(morgan('dev')); //logging
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(session({ //lets you store cookies
  cookieName: 'session',
  secret: 'spring_beans',
  duration: 30 * 1000 * 60,
  activeDuration: 5 * 1000 * 60
}));

app.get('/api/flashcards', function(req, res) {
  Flashcard.find(function(err, flashcards) {  //mongoose schemas come with .find and .findOne methods
    if (err) {
      res.send(err);
    }
    res.json(flashcards);
  });
});

app.post('/login', function (req, res) {

  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      res.send(err);
    }

    if (user) {

      //comparePassword hashes the pw and checks the hash in the DB
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) {
          res.send(err);
        }
        if (isMatch) {
          req.session.user = user;  //stores cookie!
          res.json(user);
        } else {
          res.json(null);
        }
      });
    } else {
      res.json(null);
    }
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.listen(8082);
console.log("Listening on port 8082");
