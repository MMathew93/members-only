var express = require('express');
var router = express.Router();

let message = require('../controllers/messageController')

//get message create form
router.get('/create', message.getMessageCreate);

//post message created
router.post('/create', message.postMessageCreate);

//post delete messages
router.post('/remove/:id', message.postDeleteMessage);

module.exports = router;
