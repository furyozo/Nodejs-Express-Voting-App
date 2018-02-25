var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var express = require('express');
var session = require('express-session')
var ObjectId = mongoose.Types.ObjectId

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost:27017/')

var PollSchema = new mongoose.Schema({
  user_id: {
    type: ObjectId,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  options: [ String ],
  answers: [ Number ],
  user_ips: [ String ],
  created_at: { type: Date, default: Date.now }
});

/**
 * returns all users polls
 * @param  {Poll} user_id id of the user whose polls are to be returned
 * @return {Poll} polls return poll objects specified by user_id
 */
PollSchema.statics = {

  // create a new poll
  create: function(options, req, callback) {
    var poll = new this({
      user_id: req.session.user._id,
      name: req.body.name,
      options: options,
      answers: []
    });
    for (var i = 0; i < options.length; i++) {
      poll.answers.push(0)
    }
    poll.save(err => {
      if (err) callback(err)
      else callback(err, poll)
    });
  },

  // add a vote to the poll
  addAnswer: function(req, callback) {
    var id = req.params.id
    var option = req.params.option
    var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(",")[0]
    this.findById(id, function(err, poll) {
      if (err) return callback(err)
      else {
        poll.answers.set(option, poll.answers[option]+1)
        poll.user_ips.push(ip)
        poll.save()
        return callback(null, poll)
      }
    })
  },

  // add a new vote to an existing poll
  vote: function(req, callback) {
    var id = req.params.id
    var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(",")[0]
    // check if user already responded to poll
    Poll = this
    Poll.findOne({'_id': id, 'user_ips': ip}, function(err, poll) {
      if (err) return callback(err)
      else if (poll) {
        var err = new Error('you already voted on this poll')
        err.status = 401
        return callback(err, poll)
      }
      else return Poll.addAnswer(req, callback)
    })
  }

}


module.exports = mongoose.model('Poll', PollSchema);
