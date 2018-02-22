var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

mongoose.connect('mongodb://localhost:27017/')

var PollSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    trim: true
  }
});

/**
 * registers a new Poll
 * @param  {Request} req request containing all Poll inputted data
 * @return {[type]}     [description]
 */
PollSchema.statics.create = function (req) {

  // create a new database-inputtable object
  var Poll = {
    name: req.body.login
  }

  // use schema.create to insert data into the db
  this.create(Poll, function (err, Poll) {
    if (err) console.log(err)
    else console.log("Poll Created")
  });

}

module.exports = mongoose.model('Poll', PollSchema);;
