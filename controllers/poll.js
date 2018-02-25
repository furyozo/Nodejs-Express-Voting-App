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
  Poll.create(options, req, function(err, poll) {
    if (err) return res.status(500).send(err);
    else res.redirect('/home')
  })
})

/* get a single poll view */
router.get('/:id', function(req, res, next) {
  var id = req.params.id
  Poll.findOne({ _id: id }, (err, poll) => {
    if (err) res.status(500).send(err)
    else res.render('poll', {poll: poll})
  })
})

/* add a new option to existing poll */
router.post('/:id/edit', function(req, res, next) {
  var id = req.params.id
  if (req.body.option.length === 0) {
    res.render('/home', { err: 'You need to specify the poll option' });
    return
  }
  Poll.findOne({ _id: id }, (err, poll) => {
    if (err) res.status(500).send(err)
    else if (poll.user_id != req.session.user._id) res.redirect('/')
    else {
      poll.options.push(req.body.option)
      poll.answers.push(0)
      poll.save()
      res.redirect('/home')
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

/* search through existing polls */
router.post('/search', function(req, res, next) {
  var name = req.body.text
  Poll.find({name: new RegExp('^'+name+'$', "i")}, function(err, polls) {
    if (err) res.status(500).send(err)
    else res.render('index', { user: req.session.user, polls: polls });
  })
})

/* select a poll option */
router.get('/:id/option/:option', function(req, res, next) {
  var id = req.params.id
  Poll.vote(req, function(err, poll) {
    if (err) {
      if (err.status != 401) return res.status(500).send(err)
      else return res.render('poll', {poll: poll, err: err})
    }
    else return res.redirect('/poll/'+id)
  })
})

module.exports = router;
