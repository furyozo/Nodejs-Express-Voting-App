var express = require('express');
var router = express.Router();

var User = require('../models/User.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'Express' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('auth/register')
});

/* login a user */
router.post('/login', function(req, res, next) {
  User.register(req);
  res.send('user registered');
});

/* register a new user */
router.post('/register', function(req, res, next) {
  if (!req.body.email || !req.body.username || !req.body.password || !req.body.passwordConf)  // check whether all form data was inputted
    res.render('auth/register', {err: "some form data is missing"})
  else if (req.body.password != req.body.passwordConf)  // check whether the password and repeated password are matching
    res.render('auth/register', {err: "passwords are not matching"})
  else {
    User.register(req);
    res.render('/');
  }
});

/* GET /logout */
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


module.exports = router;
