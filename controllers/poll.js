var session = require('express-session')
var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var Poll = require('../models/Poll.js');
var PollOption = require('../models/PollOption.js');

/* create a new poll */
router.post('/create', function(req, res, next) {

  // format and validate poll options
  var options = req.body['option[]'];
  options = options.filter(function(n){ return n.length != 0 });
  if (options.length < 2) {
    res.render('home', {err: "The poll needs to have at least two options"});
    return;
  }

  // create a new poll
  var poll = new Poll({
    user_id: req.session.user._id,
    name: req.body.name
  });
  poll.save(err => {
    if (err) return res.status(500).send(err);
  });

  // create all poll options
  for (var i = 0; i < options.length; i++) {
    var polloption = new PollOption({
      poll_id: poll.id,
      name: options[i]
    });
    polloption.save(err => {
      if (err) return res.status(500).send(err);
    });
  }

  res.redirect('/home');

})

/* delete en existing poll */
router.get('/delete', function(req, res, next) {
  Poll.delete(req);
  res.redirect('/home');
})

module.exports = router;
