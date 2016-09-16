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

var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/flashcards');

app.use(express.static('/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());


var testUser = new User({
  username: 'john',
  password: 'test123'
});

User.findOne({ username: 'john'}, function (err, user) {
  if (err) {
    throw err;
  }

  user.comparePassword('test123', function (err, isMatch) {
    if (err) throw err;
    console.log('test123: ', isMatch);
  });

  user.comparePassword('123test', function (err, isMatch) {
    if (err) throw err;
    console.log('123test: ', isMatch);
  });
});


app.get('/api/flashcards', function(req, res) {
  Flashcard.find(function(err, flashcards) {
    if (err) {
      res.send(err);
    }
    res.json(flashcards);
  });
});

app.get('/', function(req, res) {
  res.sendfile('public/index.html');
});

app.get('/login.html', function (req, res) {
  res.sendfile('public/login.html');
});

app.get('/js/app.js', function(req, res) {
  res.sendfile('public/js/app.js');
});

app.get('/js/controllers/homeCtrl.js', function(req, res) {
  res.sendfile('public/js/controllers/homeCtrl.js');
});

app.get('/js/controllers/loginCtrl.js', function(req, res) {
  res.sendfile('public/js/controllers/loginCtrl.js');
});

app.listen(8082);
console.log("Listening on port 8082");
