var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'Express' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('auth/register', { title: 'Express' });
});


module.exports = router;
