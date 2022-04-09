const User = require('../models/user.schema');
const Post = require('../models/post.schema');
const Community = require('../models/community.schema');
const Comment = require('../models/comment.schema');
const fs = require('fs')

module.exports.showAPI = async(req, res, next) => {
    const APIreturn = await Community.find({ name: req.query.communityName });
    res.send({ APIreturn })
}

module.exports.showCommunityAPI = async(req, res, next) => {
    const community = await Community.findOne({ name: req.params.name });
    const total = await Post.find({ community: community._id }).countDocuments();
    const posts = await Post.find({ coummunity: community._id })
        .sort({ dateCreated: req.query.sort })
        .skip(req.query.skip)
        .limit(req.query.limit).populate('author');
    for (let post of posts) {
        post.author.memberships = []
        post.author.comments = []
        post.author.posts = []
    }
    let postObject = {
        total,
        posts
    }
    res.send(postObject)

}

module.exports.test = async(req, res) => {
    res.render('api/test')
}