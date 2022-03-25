const Community = require('../models/community.schema')
const User = require('../models/user.schema')

module.exports.showContent = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'memberships',
            populate: {
                path: 'posts',
                populate: 'title',
                populate: 'body',
                populate: 'author',
                populate: {
                    path: 'community'
                },
            }
        }).populate('memberships');
        console.log(`UserMemberships: ${user}`)
        console.log(`UserMembershipsPost ${user.memberships.posts}`)
        const posts = user.memberships.posts;
        console.log({ posts })
        res.render('index', { user, posts })
    } catch {
        res.render('index')
    }

}