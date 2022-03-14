const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    nameFirst: String,
    nameLast: String,
    location: String,
    roles: String,
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community'
    },
    posts: {
        type: Schema.Types.ObjectId,
        ref: 'Posts'
    },
    comments: {
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }
})
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);