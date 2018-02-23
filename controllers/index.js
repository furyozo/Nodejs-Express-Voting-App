var express = require('express');
var router = express.Router();
var session = require('express-session')

var User = require('../models/User.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.session.user });
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
  User.login(req.body.email, req.body.password, function(err, user) {
    if (!req.body.email || !req.body.password)
      res.render('auth/login', {err: "some form data is missing"});
    else if (!user)
      res.render('auth/login', {err: "the user credentials were not found"});
    else if (user) {
      req.session.cookie.expires = new Date(Date.now() + 3600000 * 24)
      req.session.auth = true;
      req.session.user = user;
      res.redirect('/home');
    }
  });
});

/* register a new user */
router.post('/register', function(req, res, next) {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.repassword)  // check whether all form data was inputted
    res.render('auth/register', {err: "some form data is missing"})
  else if (req.body.password != req.body.repassword)  // check whether the password and repeated password are matching
    res.render('auth/register', {err: "passwords are not matching"})
  else {
    User.register(req);
    res.redirect('/');
  }
});

/* GET /logout */
router.get('/logout', function(req, res, next) {
  delete req.session.auth;
  delete req.session.user;
  res.redirect('/');
});


module.exports = router;
