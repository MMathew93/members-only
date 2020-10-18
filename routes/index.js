var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Member\'s only message board', user: req.user });
});

module.exports = router;
