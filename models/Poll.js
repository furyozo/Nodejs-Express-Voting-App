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
  answers: [{
    user_id: ObjectId,
    option: Number
  }]
});

/**
 * returns all users polls
 * @param  {Poll} user_id id of the user whose polls are to be returned
 * @return {Poll} polls return poll objects specified by user_id
 */
PollSchema.statics.getByUserID = function (user_id) {
  this.find({user_id: user_id}, (err, polls) => {
    if (err) return err;
    return polls;
  });
}

module.exports = mongoose.model('Poll', PollSchema);
