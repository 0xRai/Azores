const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post.schema')
const User = require('./user.schema')

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
    description: {
        type: String,
        default: "Just a generic description!"
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, opts);

CommunitySchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Post.deleteMany({
            _id: {
                $in: doc.posts
            }
        })
    }
})

module.exports = mongoose.model('Community', CommunitySchema);