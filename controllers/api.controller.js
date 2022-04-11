const Post = require('../models/post.schema');
const Community = require('../models/community.schema');
const moment = require('moment');

module.exports.showAPI = async(req, res, next) => {
    const APIreturn = await Community.find({ name: req.query.communityName });
    res.send({ APIreturn })
}

module.exports.showCommunityAPI = async(req, res, next) => {
    const community = await Community.findOne({ name: req.params.name });
    const total = await Post.find({ community: community._id }).countDocuments();
    if (req.query.sortBy === 'New') {
        let posts = await Post.find({ coummunity: community._id })
            .sort({ dateCreated: -1 })
            .skip(req.query.skip)
            .limit(req.query.limit)
            .populate('author');
        for (let post of posts) {
            post.author.memberships = [];
            post.author.comments = [];
            post.author.posts = [];
            post.dateCreatedFormat = moment(post.dateCreated).format('lll');
        }
        let postObject = {
            total,
            posts
        }
        res.send(postObject)
    } else if (req.query.sortBy === 'Top') {
        const posts = await Post.find({ coummunity: community._id })
            .sort({ rating: -1 })
            .skip(req.query.skip)
            .limit(req.query.limit)
            .populate('author');
        for (let post of posts) {
            post.author.memberships = [];
            post.author.comments = [];
            post.author.posts = [];
            post.dateCreatedFormat = moment(post.dateCreated).format('lll');
        }
        let postObject = {
            total,
            posts
        }
        res.send(postObject)
    } else if (req.query.sortBy === 'Hot') {
        const posts = await Post.find({ coummunity: community._id })
            .sort({ dateModified: -1 })
            .skip(req.query.skip)
            .limit(req.query.limit)
            .populate('author');
        for (let post of posts) {
            post.author.memberships = [];
            post.author.comments = [];
            post.author.posts = [];
            post.dateCreatedFormat = moment(post.dateCreated).format('lll');
        }
        let postObject = {
            total,
            posts
        }
        res.send(postObject)
    } else {
        res.send('Unable to query request')
    }

}


module.exports.test = async(req, res) => {
    res.render('api/test')
}