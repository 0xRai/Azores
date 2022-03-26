const e = require('connect-flash');
const Community = require('../models/community.schema');
const User = require('../models/user.schema')
const mongoose = require('mongoose')
module.exports.index = async(req, res) => {
    const communities = await Community.find({});
    res.render('communities/index', { communities })
};

module.exports.renderNewForm = (req, res) => {
    res.render('communities/new');
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
        populate: {
            path: 'author',
        }
    }).populate('creator')
    if (!community) {
        req.flash('error', 'Community not found!');
        return res.redirect('/c')
    }
    res.render('communities/show', { community });
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const community = await Community.findById(id);
    if (!community) {
        req.flash('error', 'Community not found!');
        return res.redirect('/c')
    }
    res.render('communities/edit', { community });
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