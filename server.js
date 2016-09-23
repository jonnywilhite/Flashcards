"use strict";

const express = require('express');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Schema.ObjectId;
const bcrypt = require('bcrypt'); //hashing passwords
const bodyParser = require('body-parser'); //probably used for parsing request bodies
const methodOverride = require('method-override'); //still not sure what this does
const morgan = require('morgan'); //logging
const path = require('path'); //could probably do without this
const session = require('client-sessions'); //cookies

//Model classes
const User = require('./app/model/user-model');
const Flashcard = require('./app/model/flashcard-model');

const app = express();

mongoose.connect('mongodb://localhost:27017/flashcards');

app.use(session({ //lets you store cookies
  cookieName: 'session',
  secret: 'spring_beans',
  duration: 60 * 1000 * 60,
  activeDuration: 5 * 1000 * 60
}));

app.use(function (req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ username: req.session.user.username }, function (err, user) {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        res.locals.user = user;
      }
      next();
    });
  } else {
    next();
  }
});

function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    next();
  }
}

app.use(morgan('dev')); //logging
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

app.get('/api/flashcards', function(req, res) {
  if (req.session.user) {
    Flashcard.find({user: req.session.user.username}, function(err, flashcards) {  //mongo schemas come with .find and .findOne methods
      if (err) {
        res.send(err);
      }
      res.json(flashcards);
    });
  } else {
    res.json({message: "Please log in to view your flashcards"});
  }
});

app.post('/api/flashcards', function (req, res) {
  if (req.session.user) {
    Flashcard.create({
      question: req.body.question,
      answer: req.body.answer,
      user: req.session.user.username,
    }, function(err, flashcard) {
        if (err) {
          res.send(err);
        }
        res.json(flashcard);
      }
    );
  } else {
    res.json({message: "Please log in to add flashcards"});
  }
});

app.put('/api/flashcards/:cardKey', function (req, res) {
  Flashcard.findOne({_id: mongoose.Types.ObjectId(req.params.cardKey)}, function (err, flashcard) {
    if (err) {
      res.send(err);
    }
    flashcard.question = req.body.question;
    flashcard.answer = req.body.answer;
    flashcard.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({message : 'Updated card'});
    });
  });
});

app.delete('/api/flashcards/:cardKey', function (req, res) {
  Flashcard.remove({_id: mongoose.Types.ObjectId(req.params.cardKey)}, function (err, flashcard) {
    if (err) {
      res.send(err);
    }
    res.json({message: 'Deleted card'});
  });
});

app.get('/api/users/:username', function (req, res) {
  if (!req.headers['awesome-header']) {
    res.json({message: "Nothing to see here"});
  } else {
    User.findOne({ usernameLower: req.params.username.toLowerCase() }, function (err, user) {
      if (err) {
        res.send(err);
      }
      if (user) {
        res.json(user.username);
      } else {
        res.json(null);
      }
    });
  }
});

app.post('/api/users', function (req, res) {
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
    usernameLower: req.body.usernameLower,
    firstName: req.body.firstName
  });
  newUser.save(function (err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
});

app.post('/login', function (req, res) {

  User.findOne({ usernameLower: req.body.username.toLowerCase() }, function (err, user) {
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

app.get('/register', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/home', requireLogin, function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/logout', function (req, res) {
  req.session.reset();
  res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.use(function (req, res, next) {
  if (req.path.indexOf('/js') === 0 || req.path.indexOf('/css') === 0 || req.path.indexOf('/img') === 0) {
    next();
  } else {
    if (!req.headers['awesome-header']) {
      res.json({message: "Nothing to see here"});
    } else {
      next();
    }
  }
});

app.use(express.static(__dirname + '/public')); //lets you serve static files

app.listen(8082);
console.log("Listening on port 8082");
