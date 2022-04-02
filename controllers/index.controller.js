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
                    path: 'community',
                    model: Community,
                },
                populate: {
                    path: 'author',
                    model: User,
                }
            },
        });
        const communities = user.memberships;
        let posts = [];
        for (let community of communities) {
            posts.push(community.posts)
        }
        let postsMerged = posts.flat();
        console.log(postsMerged)
        res.render('index', { user, communities })
    } catch {
        res.render('index')
    }
}