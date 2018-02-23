var session = require('express-session')
var express = require('express');
var router = express.Router();

var Authenticator = require('../middlewares/Authenticate.js');
var Poll = require('../models/Poll.js');

/* create a new poll */
router.get('/', Authenticator.isAuthenticated, function(req, res, next) {
  res.render('home', { user: req.session.user });
})

/* delete en existing poll */
router.get('/delete', function(req, res, next) {
  Poll.delete(req);
  res.send('respond with a resource');
})

module.exports = router;
