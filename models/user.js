let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UserSchema = new Schema(
    {
        first_name: { type: String, required: true, maxlength: 30 },
        last_name: { type: String, required: true, maxlength: 30 },
        user_name: { type: String, required: true, maxlength: 15},
        password: { type: String, required: true },
        membership_status: { type: String, required: true, enum: ['default', 'member'], default: 'default'},
        isAdmin: { type: Boolean, default: false }
    }
);

UserSchema
.virtual('fullname')
.get(function() {
    return `${this.first_name} ${this.last_name}`;
});

UserSchema
.virtual('isMember')
.get(function() {
    return this.membership_status === 'member'
});

module.exports = mongoose.model('User', UserSchema);