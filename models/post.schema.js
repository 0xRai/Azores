const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment.schema')

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

PostSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Post', PostSchema);