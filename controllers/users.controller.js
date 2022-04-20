const User = require('../models/user.schema');

module.exports.showUser = async(req, res) => {
    const user = await grabUser(req)
    res.render('user/show', { user, title: `${user.username}'s Profile` });
}

module.exports.showUserTop = async(req, res) => {
    const user = await grabUser(req)
    res.render('user/showTop', { user, title: `${user.username}'s Profile` });
}

module.exports.showUserComment = async(req, res) => {
    const user = await grabUser(req)
    res.render('user/showCommentNew', { user, title: `${user.username}'s Profile` });
}

module.exports.showUserCommentTop = async(req, res) => {
    const user = await grabUser(req)
    res.render('user/showCommentTop', { user, title: `${user.username}'s Profile` });
}

async function grabUser(req) {
    return await User.findOne({ username: req.params.username });
}