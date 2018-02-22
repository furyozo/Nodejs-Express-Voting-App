var session = require('express-session')
var express = require('express');
var router = express.Router();

var Poll = require('../models/Poll.js');

/* create a new poll */
router.post('/create', function(req, res, next) {
  Poll.create(req);
  res.send('respond with a resource');
})

/* delete en existing poll */
router.get('/delete', function(req, res, next) {
  Poll.delete(req);
  res.send('respond with a resource');
})

module.exports = router;
