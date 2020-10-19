var express = require('express');
var router = express.Router();
let admin = require('../controllers/adminController')

//post join membership and admin status
router.post('/join', admin.postBecomeAdmin);

module.exports = router;