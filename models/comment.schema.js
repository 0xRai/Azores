const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
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
    comment: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

module.exports = mongoose.model('Comment', CommentSchema);