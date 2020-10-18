let mongoose = require('mongoose');
let moment = require('moment');

let Schema = mongoose.Schema;

let MessageSchema = new Schema(
    {
        title: { type: String, required: true, maxlength: 50 },
        text: { type: String, required: true, maxlength: 255 },
        time_stamp: { type: Date, required: true, default: new Date() },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }
);

MessageSchema
.virtual('time_stampFormatted')
.get(function() {
    return moment(this.time_stamp).format('LLLL');
});


module.exports = mongoose.model('Message', MessageSchema);