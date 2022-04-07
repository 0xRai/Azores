const User = require('../models/user.schema');
const Post = require('../models/post.schema');
const Community = require('../models/community.schema');
const Comment = require('../models/comment.schema');

module.exports.showUser = async(req, res) => {
    const user = await User.findOne({ username: req.params.username }).populate({
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
    });
    res.render('user/show', { user, title: `${user.username}'s Profile` });
}

module.exports.showUserTop = async(req, res) => {
    const userUnflat = await User.find({ username: req.params.username });
    const user = await User.findById(userUnflat[0]).populate({
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