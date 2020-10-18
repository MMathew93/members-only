let User = require('../models/user');
const { check, validationResult} = require('express-validator');

//Display member form on get
exports.getBecomeMember = function(req, res, next) {
    if(!req.user) {
        res.redirect('/user/login')
    }
    res.render('member-form', { title: 'Member\'s only message board - Join Membership', h1: 'Become a member', user: req.user })
};

//POST become member and update status
exports.postBecomeMember = [
    check('passcode')
        .custom((value, { req }) => {
            if(value !== 'hushhush') {
                throw new Error('That isn\'t the secret password')
            }
            return true;
        }),
        async(req, res, next) => {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                res.render('member-form', { title: 'Member\'s only message board - Join Membership', h1: 'Become a member', errors: errors.array({ onlyFirstError: true }) });
                return;
            }else {
                User.findByIdAndUpdate(req.user._id, { membership_status: 'member' });
                res.redirect('/');
            }
        }
]