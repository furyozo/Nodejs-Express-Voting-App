var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var express = require('express');
var session = require('express-session')

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost:27017/')

var PollOptionSchema = new mongoose.Schema({
  poll_id: {
    type: ObjectId,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('PollOption', PollOptionSchema);
