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

  User.findOne(loggedInUser, function (err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
});

app.get('/', function(req, res) {
  res.sendfile('public/views/index.html');
});

app.get('/login.html', function (req, res) {
  res.sendfile('public/views/login.html');
});

app.get('/home.html', function (req, res) {
  res.sendfile('public/views/home.html');
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

app.get('/js/services/authService.js', function(req, res) {
  res.sendfile('public/js/services/authService.js');
});

app.listen(8082);
console.log("Listening on port 8082");
