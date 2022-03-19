const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        ref: 'Communities',
    },
    author: {
        type: String,
        default: 'TestUser',
    },
})

module.exports = mongoose.model('Post', PostSchema);