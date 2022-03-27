const Community = require('../models/community.schema')
const User = require('../models/user.schema')

module.exports.showContent = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'memberships',
            model: Community,
        }).populate('memberships');
        const communities = user.memberships;
        res.render('index', { user, communities })
    } catch {
        res.render('index')
    }
}