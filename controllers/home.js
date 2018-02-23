var session = require('express-session')
var express = require('express');
var router = express.Router();

var Authenticator = require('../middlewares/Authenticate.js');
var Poll = require('../models/Poll.js');

/* create a new poll */
router.get('/', Authenticator.isAuthenticated, function(req, res, next) {
  /* needs to be moved somewhere smarter */
  Poll.find({user_id: req.session.user._id}, (err, polls) => {
    if (err) return err;
    res.render('home', { user: req.session.user, polls: polls });
  });
})

/* delete en existing poll */
router.get('/delete', function(req, res, next) {
  Poll.delete(req);
  res.send('respond with a resource');
})

module.exports = router;
