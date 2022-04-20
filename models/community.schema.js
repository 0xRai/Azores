const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post.schema');
const User = require('./user.schema');

const CommunitySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    visibility: {
        type: Boolean,
        default: true,
        whitelist: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
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
    lastPost: {
        type: Date,
        default: Date.now,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    roles: {
        admin: {
            users: [{
                type: Schema.Types.ObjectId,
                ref: 'User',
            }],
            perms: {
                canStickyPosts: {
                    type: Boolean,
                    default: true,
                },
                canMakeAnnouncments: {
                    type: Boolean,
                    default: true,
                },
                canBanUsers: {
                    type: Boolean,
                    default: true,
                },
                canDeletePosts: {
                    type: Boolean,
                    default: true,
                },
                canModifyCommunity: {
                    type: Boolean,
                    default: true,
                },
                canChangeMods: {
                    type: Boolean,
                    default: true,
                },
                canChangeAdmins: {
                    type: Boolean,
                    default: true,
                },
                canModifyRoles: {
                    type: Boolean,
                    default: true,
                }
            },
        },
        mod: {
            users: [{
                type: Schema.Types.ObjectId,
                ref: 'User',
            }],
            perms: {
                canStickyPosts: {
                    type: Boolean,
                    default: false,
                },
                canMakeAnnouncments: {
                    type: Boolean,
                    default: false,
                },
                canBanUsers: {
                    type: Boolean,
                    default: true,
                },
                canDeletePosts: {
                    type: Boolean,
                    default: true,
                },
                canModifyCommunity: {
                    type: Boolean,
                    default: false,
                },
                canChangeMods: {
                    type: Boolean,
                    default: false,
                },
                canChangeAdmins: {
                    type: Boolean,
                    default: false,
                },
                canModifyRoles: {
                    type: Boolean,
                    default: false,
                }
            },
        },
        banned: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    }
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