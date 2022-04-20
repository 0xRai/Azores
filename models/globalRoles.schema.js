const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GlobalRolesSchema = new Schema({
    admin: [{
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
    }],
    mod: [{
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
    }],
    banned: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

module.exports = mongoose.model('GlobalRoles', GlobalRolesSchema)