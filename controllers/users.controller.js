const User = require('../models/user.schema');
const Post = require('../models/post.schema');
const Community = require('../models/community.schema');
const Comment = require('../models/comment.schema');

module.exports.showUser = async(req, res) => {
    const user = await User.findById(req.params.id).populate({
        path: 'posts',
        model: Post,
        populate: {
            path: 'community',
            model: Community,
        },
    }).populate({
        path: 'comments',
        model: Comment,
        populate: {
            path: 'post',
            model: Post,
            populate: {
                path: 'community',
                model: Community,
            },
        },
    })
    res.render('user/show', { user, title: `${user.username}'s Profile` })
}

module.exports.showUserTop = async(req, res) => {
    const user = await User.findById(req.params.id).populate({
        path: 'posts',
        model: Post,
        populate: {
            path: 'community',
            model: Community,
        },
    }).populate({
        path: 'comments',
        model: Comment,
        populate: {
            path: 'post',
            model: Post,
            populate: {
                path: 'community',
                model: Community,
            },
        },
    })
    res.render('user/showTop', { user, title: `${user.username}'s Profile` })
}