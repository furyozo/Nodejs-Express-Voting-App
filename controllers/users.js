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


module.exports = router;
