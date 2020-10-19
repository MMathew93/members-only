require('dotenv').config();
let User = require('../models/user');
const { check, validationResult} = require('express-validator');
const adminCode = process.env.ADMIN

//POST become admin and member, updates status
exports.postBecomeAdmin = [
    check('admincode')
        .equals(adminCode)
        .withMessage('That\'s not the super secret code!'),
        async(req, res, next) => {
            const errors = await validationResult(req)
            if(!errors.isEmpty()) {
                res.render('profile', { title: 'Member\'s only message board - Profile', h1: 'My Profile', user: req.user, fullname: req.user.fullname,  membershipStatus: req.user.membership_status, adminStatus: req.user.isAdmin, errors: errors.array({ onlyFirstError: true }) });
                return;
            }else {
                await User.findByIdAndUpdate(req.user._id, { isAdmin: true });
                await User.findByIdAndUpdate(req.user._id, { membership_status: 'member' });
                res.redirect('/user/profile');
            }
        }
];
