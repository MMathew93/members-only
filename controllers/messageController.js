let Message = require('../models/message');
const { check, validationResult, body } = require('express-validator');

//Display message create on GET
exports.getMessageCreate = function(req, res, next) {
    if(!req.user) {
        res.redirect('/user/login')
    }
    res.render('message-form', {title: 'Member\'s only message board - Create post', h1: 'Create a post', user: req.user})
}

exports.postMessageCreate = [
    //validate fields
    body('title')
        .isLength({ min: 1})
        .trim()
        .withMessage('Title cannot be empty'),
    body('messagetext')
        .isLength({ min: 1})
        .trim()
        .withMessage('Your post cannot be empty'),

        async(req, res, next) => {
            const errors = await validationResult(req)
            //Data is not valid
            if(!errors.isEmpty()) {
                res.render('message-form', {title: 'Member\'s only message board - Create post', h1: 'Create a post', errors: errors.array({ onlyFirstError: true }) });
            }else {
                let message = new Message(
                    {
                        title: req.body.title,
                        text: req.body.messagetext,
                        time_stamp: new Date(),
                        user: req.user
                    }
                )
                await message.save(function(err) {
                    if(err) { return next(err); }
                    res.redirect('/');
                });
            }
        }
];

//POST to Delete/Remove Message
exports.postDeleteMessage = async(req, res, next) => {
    if(!req.user) {
        res.redirect('/user/login')
    }
    if(req.user.isAdmin) {
        await Message.findByIdAndRemove(req.params.id);
        res.redirect('/');
    }
};