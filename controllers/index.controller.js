const Community = require('../models/community.schema')
const User = require('../models/user.schema')

module.exports.showContent = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'memberships',
            populate: { path: 'memberships' }
        }).populate('memberships');
        console.log(user)
        res.render('index', { user })
    } catch {
        res.render('index')
    }

}