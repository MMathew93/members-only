var express = require('express');
var router = express.Router();
let index = require('../controllers/indexController')

/* GET home page. */
router.get('/', index.getIndex);

module.exports = router;
