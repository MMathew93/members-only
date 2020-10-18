var express = require('express');
var router = express.Router();
let member = require('../controllers/memberController')

//get join form
router.get('/join', member.getBecomeMember);

//post join and update membership status
router.post('/join', member.postBecomeMember);


module.exports = router;