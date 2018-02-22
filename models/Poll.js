var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

mongoose.connect('mongodb://localhost:27017/')

var PollSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
});

/**
 * hashing a password before saving it to the database
 */
PollSchema.pre('save', function (next) {
  var Poll = this;
  bcrypt.hash(Poll.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    Poll.password = hash;
    next();
  })
});

/**
 * registers a new Poll
 * @param  {Request} req request containing all Poll inputted data
 * @return {[type]}     [description]
 */
PollSchema.statics.create = function (req) {

  var PollData = {
    login: req.body.login,
    email: req.body.email,
    password: req.body.password
  }

  // use schema.create to insert data into the db
  this.create(PollData, function (err, Poll) {
    if (err) console.log(err)
    else console.log("Registered :]")
  });

}

/**
 * authenticate input against database
 */
PollSchema.statics.authenticate = function (email, password, callback) {
  Poll.findOne({ email: email })
  .exec(function (err, Poll) {
    if (err) {
      return callback(err)
    } else if (!Poll) {
      var err = new Error('Poll not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, Poll.password, function (err, result) {
      if (result === true) {
        return callback(null, Poll);
      } else {
        return callback();
      }
    })
  });
}

module.exports = mongoose.model('Poll', PollSchema);;
