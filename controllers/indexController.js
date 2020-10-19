const Message = require('../models/message');
const User = require('../models/user');

exports.getIndex = async(req, res, next) => {
    const messages = await Message.find().populate('user')
    res.render('index', { title: 'Member\'s only message board', user: req.user, messages })
}