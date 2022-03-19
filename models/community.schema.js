const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const CommunitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
    }
    // creator: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Users'
    // },
})

module.exports = mongoose.model('Community', CommunitySchema);