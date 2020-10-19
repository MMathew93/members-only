let User = require('../models/user');
const { check, validationResult, body } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

//Display user create on GET
exports.getUserCreate = function(req, res, next) {
    res.render('signup-form', { title: 'Member\'s only message board - SignUp', h1: 'Signup' });
};

//Handle user create on POST
exports.postUserCreate = [
    //validate fields
    body('firstname')
        .isLength({ min: 1 })
        .trim()
        .withMessage('First name cannot be empty')
        .isAlpha()
        .withMessage('First name must contain letters only'),
    body('lastname')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Last name cannot be empty')
        .isAlpha()
        .withMessage('Last name must contain letters only'),
    body('username')
        .isLength({ min: 1 })
        .trim()
        .withMessage('Username cannot be empty')
        .isAlphanumeric()
        .withMessage('Username contains non-alphanumeric characters'),
    check('username')
        .custom((value, {req}) => {
        return new Promise((resolve, reject) => {
            User.findOne({user_name:req.body.username}, function(err, user){
                if(err) {
                    reject(new Error('Server Error'))
                }
                if(Boolean(user)) {
                    reject(new Error('Username already in use'))
                }
                resolve(true)
          });
        });
    }),
    body('password')
        .isLength({ min: 8 })
        .trim()
        .withMessage('Password must be 8 characters long, max of 15')
        .isAlphanumeric()
        .withMessage('Password has to contain letters and numbers only'),
    check('confirmpassword')
        .custom((value, { req }) => {
            if(value !== req.body.password) {
                throw new Error('Passwords don\'t match');
            }
            return true;
        }),
        async(req, res, next) => {
            const errors = await validationResult(req)
            //Data is not valid
            if(!errors.isEmpty()) {
                res.render('signup-form', { title: 'Member\'s only message board - SignUp', h1: 'Signup', errors: errors.array({ onlyFirstError: true }) });
                return;
            }else {
                //Data is valid
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    if(err) { return next(err); }
                let user = new User(
                    {
                       first_name: req.body.firstname,
                       last_name: req.body.lastname,
                       user_name: req.body.username,
                       password: hashedPassword
                    }
                );
                user.save(function(err) {
                    if(err) { return next(err); }
                    res.redirect('/');
                });
            })
        }
    }
];

//Display user login on GET
exports.getUserLogin = function(req, res, next) {
    res.render('login-form', { title: 'Member\'s only message board - Login', h1: 'Login' });
};

//Handle user login on POST
exports.postUserLogin = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(!user) {
            res.render('login-form', { title: 'Member\'s only message board - Login', h1: 'Login', errors: info });
            return;
        }else {
            req.login(user, function(err) {
                if(err) { return next(err); }
                res.redirect('/');
            });
        }
    })(req, res, next);
};

//Display user logout on GET
exports.getUserLogout = function(req, res, next) {
    req.logout();
    res.redirect('/');
};

//Display user profile on GET
exports.getUserProfile = function(req, res, next) {
    if(!req.user) {
        res.redirect('/user/login')
    }
    res.render('profile', { title: 'Member\'s only message board - Profile', h1: 'My Profile', user: req.user, fullname: req.user.fullname,  membershipStatus: req.user.membership_status, adminStatus: req.user.isAdmin });
};