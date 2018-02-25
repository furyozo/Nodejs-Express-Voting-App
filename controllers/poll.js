var session = require('express-session')
var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var Poll = require('../models/Poll.js');

/* create a new poll */
router.post('/create', function(req, res, next) {

  // format and validate poll options
  var options = req.body['option[]'];
  options = options.filter(function(n){ return n.length != 0 })
  if (options.length < 2) {
    res.render('home', {err: "The poll needs to have at least two options"})
    return
  }

  // create a new poll
  var poll = new Poll({
    user_id: req.session.user._id,
    name: req.body.name,
    options: options,
    answers: []
  });
  for (var i = 0; i < options.length; i++) {
    poll.answers.push(0)
  }
  poll.save(err => {
    if (err) return res.status(500).send(err);
    else res.redirect('/home')
  });

})

/* get the single poll view */
router.get('/:id', function(req, res, next) {
  var id = req.params.id
  Poll.findOne({ _id: id }, (err, poll) => {
    if (err) res.status(500).send(err)
    else res.render('poll', {poll: poll})
  })
})

/* select a poll option */
router.get('/:id/option/:option', function(req, res, next) {
  var id = req.params.id
  var option = req.params.option
  var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(",")[0]

  // check if user already responded to poll
  // Poll.findOne({'user_ips': ip}, function(err, poll) {
  //   if (err) return console.error(err);
  //   // {err: "You have already voted in this poll"}
  //   if (poll) return res.redirect('/poll/'+id)
  //   next()
  // })

  // Poll.addAnswer(req)

  Poll.findById(id, (err, poll) => {
    if (err) res.status(500).send(err)
    else {
      poll.answers.set(option, poll.answers[option]+1)
      poll.user_ips.push(ip)
      poll.save()
      res.redirect('/poll/'+id);
    }
  })

})

/* delete en existing poll */
router.get('/:id/delete', function(req, res, next) {
  var id = req.params.id
  Poll.remove({ _id: id }, (err) => {
    if (err) res.status(500).send(err)
    else res.redirect('/home')
  })
})

module.exports = router;
