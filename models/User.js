var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

mongoose.connect('mongodb://localhost:27017/')

var UserSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

/**
 * hashing a password before saving it to the database
 */
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

/**
 * registers a new user
 * @param  {Request} req request containing all user inputted data
 * @return {[type]}     [description]
 */
UserSchema.statics.register = function (req) {

  // create a new database-inputtable object
  var userData = {
    login: req.body.login,
    email: req.body.email,
    password: req.body.password
  }

  // use schema.create to insert data into the db
  this.create(userData, function (err, user) {
    if (err) console.log(err)
    else console.log("User Registered")
  });

}

/**
 * authenticate input against database
 */
UserSchema.statics.login = function (email, password, callback) {
  this.findOne({ email: email })
  .exec(function (err, user) {
    if (err) {
      return callback(err)
    } else if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    })
  });
}

module.exports = mongoose.model('User', UserSchema);;
