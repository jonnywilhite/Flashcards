"use strict";

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./model/user-model');
const Flashcard = require('./model/flashcard-model');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');

var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/flashcards');

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

app.get('/api/flashcards', function(req, res) {
  Flashcard.find(function(err, flashcards) {
    if (err) {
      res.send(err);
    }
    res.json(flashcards);
  });
});

app.post('/home', function (req, res) {

  var loggedInUser = new User({
    username : req.body.username,
    password : req.body.password
  });

  User.findOne({ username: loggedInUser.username }, function (err, user) {
    if (err) {
      res.send(err);
    }

    if (user) {
      user.comparePassword(loggedInUser.password, function (err, isMatch) {
        if (err) {
          res.send(err);
        }
        if (isMatch) {
          console.log('match!');
          res.json(user);
        } else {
          console.log('no match!');
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
