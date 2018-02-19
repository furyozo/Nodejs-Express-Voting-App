var mongoose = require('mongoose');
var bcrypt = require('bcrypt')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
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

var User = mongoose.model('User', UserSchema);

/**
 * registers a new user
 * @param  {Request} req request containing all user inputted data
 * @return {[type]}     [description]
 */
UserSchema.methods.register = function register(req) {

  // check whether all form data was inputted
  if (!req.body.email || !req.body.username || !req.body.password || !req.body.passwordConf) {
    console.log("some form data is missing");
  }
  // check whether the password and repeated password are matching
  if (req.body.password != req.body.passwordConf) {
    console.log("passwords are not matching");
  }

  var userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConf: req.body.passwordConf,
  }

  // use schema.create to insert data into the db
  User.create(userData, function (err, user) {
    if (err) {
      return next(err)
    } else {
      return res.redirect('/profile');
    }
  });

}

/**
 * authenticate input against database
 */
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
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

module.exports = User;
