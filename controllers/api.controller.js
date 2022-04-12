const Post = require('../models/post.schema');
const Community = require('../models/community.schema');
const User = require('../models/user.schema')
const moment = require('moment');

module.exports.showAPI = async(req, res, next) => {
    const APIreturn = await Community.find({ name: req.query.communityName });
    res.send({ APIreturn })
}

module.exports.showCommunityAPI = async(req, res, next) => {
    const community = await Community.findOne({ name: req.params.name }).populate('posts');
    const total = await Post.find({ community: community.id }).countDocuments();
    let SortBy
    if (req.query.sortBy === 'Hot') {
        SortBy = { dateModified: -1 }
    } else if (req.query.sortBy === 'New') {
        SortBy = { dateCreated: -1 }
    } else if (req.query.sortBy === 'Top') {
        SortBy = { rating: -1 }
    } else {}
    const posts = await Post.find({ community: community.id })
        .lean()
        .sort(SortBy)
        .skip(req.query.skip)
        .limit(req.query.limit)
        .populate('author');
    for (let post of posts) {
        omitFunc(post);
        post.dateCreatedFormat = moment(post.dateCreated).format('lll');
        post.community = req.params.name
    }
    let postObject = {
        total,
        posts
    }
    res.send(postObject)


}

module.exports.showUserAPI = async(req, res) => {
    const user = await User.findOne({ username: req.params.username }).populate('memberships');
    console.log(user)
}


function omitFunc(post) {
    delete post._id;
    delete post.__v;
    delete post.author._id;
    delete post.author.email;
    delete post.author.__v;
    delete post.author.memberships;
    delete post.author.comments;
    delete post.author.posts;
    delete post.author.dateCreated;
}