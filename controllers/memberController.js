require('dotenv').config();
let User = require('../models/user');
const { check, validationResult} = require('express-validator');
const memberCode = process.env.MEMBERSHIP

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
        .equals(memberCode)
        .withMessage('That\'s not the super secret code!'),
        async(req, res, next) => {
            const errors = await validationResult(req)
            if(!errors.isEmpty()) {
                res.render('member-form', { title: 'Member\'s only message board - Join Membership', h1: 'Become a member', errors: errors.array({ onlyFirstError: true }) });
                return;
            }else {
                await User.findByIdAndUpdate(req.user._id, { membership_status: 'member' });
                res.redirect('/');
            }
        }
]