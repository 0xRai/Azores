const e = require('connect-flash');
const Community = require('../models/community.schema');
const User = require('../models/user.schema');
const Post = require('../models/post.schema')
const mongoose = require('mongoose')
module.exports.index = async(req, res) => {
    const communities = await Community.find({});
    res.render('communities/index', { communities, title: 'All Communites' })
};

module.exports.renderNewForm = (req, res) => {
    res.render('communities/new', { title: 'Create a New Community' });
};

module.exports.createCommunity = async(req, res, next) => {
    const community = new Community(req.body.community);
    const user = await User.findById(req.user._id);
    community.creator = req.user._id;
    community.members.push(community.creator);
    await User.findByIdAndUpdate(user, { $push: { memberships: community._id } })
    await community.save();
    req.flash('success', 'Sucessfully made a new community!');
    res.redirect(`/c/${community._id}`);
};
module.exports.showCommunity = async(req, res) => {
    const community = await Community.findById(req.params.id).populate({
        path: 'posts',
        model: Post,
        populate: {
            path: 'author',
        }
    }).populate('creator');
    if (!community) {
        req.flash('error', 'Community not found!');
        return res.redirect('/c')
    }
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'memberships',
            model: Community,
        }).populate('memberships');
        const communities = user.memberships;
        res.render('communities/show', { community, communities, title: `${community.name}: ${community.description}` })
    } catch {
        const communities = [];
        res.render('communities/show', { community, communities, title: `${community.name}: ${community.description}` })
    }
}
module.exports.showCommunityTop = async(req, res) => {
    const community = await Community.findById(req.params.id).populate({
        path: 'posts',
        model: Post,
        populate: {
            path: 'author',
        }
    }).populate('creator');
    if (!community) {
        req.flash('error', 'Community not found!');
        return res.redirect('/c')
    }
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'memberships',
            model: Community,
        }).populate('memberships');
        const communities = user.memberships;
        res.render('communities/showTop', { community, communities, title: `${community.name}: ${community.description}` })
    } catch {
        const communities = [];
        res.render('communities/showTop', { community, communities, title: `${community.name}: ${community.description}` })
    }
}

module.exports.showCommunityHot = async(req, res) => {
    const community = await Community.findById(req.params.id).populate({
        path: 'posts',
        model: Post,
        populate: {
            path: 'author',
        }
    }).populate('creator');
    if (!community) {
        req.flash('error', 'Community not found!');
        return res.redirect('/c')
    }
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'memberships',
            model: Community,
        }).populate('memberships');
        const communities = user.memberships;
        res.render('communities/showHot', { community, communities, title: `${community.name}: ${community.description}` })
    } catch {
        const communities = [];
        res.render('communities/showHot', { community, communities, title: `${community.name}: ${community.description}` })
    }
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) {
        req.flash('error', 'Community not found!');
        return res.redirect('/c')
    }
    res.render('communities/edit', { community, title: `Edit c/${community.name}` });
}

module.exports.updateCommunity = async(req, res) => {
    const { id } = req.params;
    const community = await Community.findByIdAndUpdate(id, {...req.body.community });
    await community.save();
    req.flash('success', 'Sucessfully updated community!');
    res.redirect(`/c/${community._id}`);
}

module.exports.deleteCommunity = async(req, res) => {
    const { id } = req.params;
    await Community.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted community!');
    res.redirect('/c');
}

module.exports.joinCommunity = async(req, res) => {
    const community = await Community.findById(req.params.id);
    const user = await User.findById(req.user._id);
    community.members = req.user._id;
    const { id } = community.members;
    if ({ id } && community.members.includes({ id })) {
        req.flash('error', `You already joined ${community.name}`);
        res.redirect(`/c/${community._id}`);
    } else {
        await User.findByIdAndUpdate(user, { $push: { memberships: community._id } })
        await community.save();
    }
    req.flash('success', `Sucessfully joined ${community.name}!`);
    res.redirect(`/c/${community._id}`);
}

module.exports.leaveCommunity = async(req, res) => {
    const community = await Community.findById(req.params.id);
    const user = await User.findById(req.user._id);
    const { id } = user;
    await Community.findByIdAndUpdate(community, { $pull: { members: id } })
    await User.findByIdAndUpdate(user, { $pull: { memberships: community._id } })
    await community.save();
    req.flash('success', `Sucessfully left ${community.name}!`);
    res.redirect(`/c/${community._id}`);
}