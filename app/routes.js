module.exports = function (app) {

  function requireLogin(req, res, next) {
    if (!req.user) {
      res.redirect('/');
    } else {
      next();
    }
  }

  app.get('/api/flashcards', function(req, res) {
    Flashcard.find({user: req.session.user.username}, function(err, flashcards) {  //mongo schemas come with .find and .findOne methods
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

  app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
  });

  app.get('/home', requireLogin, function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
  });

};
