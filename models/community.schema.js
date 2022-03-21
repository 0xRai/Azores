const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post.schema')

const opts = { toJSON: { virtuals: true } };

const CommunitySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
}, opts);

module.exports = mongoose.model('Community', CommunitySchema);