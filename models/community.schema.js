const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post.schema');
const User = require('./user.schema');

const CommunitySchema = new Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
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
        default: "Just a generic description!",
        trim: true,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    lastPost: {
        type: Date,
        default: Date.now,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
});

CommunitySchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Post.deleteMany({
            _id: {
                $in: doc.posts
            }
        })
        while (await User.count({ memberships: doc._id }) !== 0) {
            const user = await User.find({ memberships: doc._id })
            await User.findByIdAndUpdate(user, { $pull: { memberships: doc._id } })
        }
    }
})

module.exports = mongoose.model('Community', CommunitySchema);