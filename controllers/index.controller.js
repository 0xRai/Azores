const Community = require('../models/community.schema')
const User = require('../models/user.schema');
const Post = require('../models/post.schema');

module.exports.showContent = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'memberships',
            model: Community,
            populate: {
                path: 'posts',
                model: Post,
                populate: {
                    path: 'author',
                    model: User,
                },
                populate: {
                    path: 'community',
                    model: Community,
                },
            },
        });
        const communities = user.memberships;
        let posts = []
        for (let community of communities) {
            posts.push(community.posts)
        }
        let postsMerged = posts.flat();
        res.render('index', { user, postsMerged })
    } catch {
        res.render('index')
    }
}