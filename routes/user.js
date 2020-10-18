var express = require('express');
var router = express.Router();

let user = require('../controllers/userController')

//get user sign in 
router.get('/create', user.getUserCreate);

//post user created
router.post('/create', user.postUserCreate);

//get user login
router.get('/login', user.getUserLogin);

//post user login
router.post('/login', user.postUserLogin);

//get user logout
router.get('/logout', user.getUserLogout);

//get user profile
router.get('/profile', user.getUserProfile);

module.exports = router;
