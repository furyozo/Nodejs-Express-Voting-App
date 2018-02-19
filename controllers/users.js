var session = require('express-session')
var express = require('express');
var router = express.Router();

var User = require('../models/User.js')

/**
 * GET users listing.
 */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * register a new user
 */
router.post('/register', function(req, res, next) {
  User.register(req);
  res.send('user registered');
});

// GET /logout
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
