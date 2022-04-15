const Post = require('../models/post.schema');
const Community = require('../models/community.schema');
const Comment = require('../models/comment.schema')
const User = require('../models/user.schema')
const moment = require('moment');
const { where } = require('../models/comment.schema');

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
        omitComm(post);
        post.dateCreatedFormat = moment(post.dateCreated).format('lll');
        post.community = req.params.name
    }
    let postJSON = {
        total,
        posts
    }
    res.send(postJSON)
}

module.exports.showUserAPI = async(req, res) => {
    let SortBy
    let total
    const user = await User.findOne({ username: req.params.username })
    if (req.query.content === 'Posts') {
        let posts
        let postJSON
        if (req.query.sortBy === 'New') {
            SortBy = { dateCreated: -1 }
        } else if (req.query.sortBy === 'Top') {
            SortBy = { rating: -1 }
        }
        posts = await Post.find({ author: user._id })
            .lean()
            .sort(SortBy)
            .skip(req.query.skip)
            .limit(req.query.limit)
            .populate('community')
        for (let post of posts) {
            omitUserPost(post);
            post.dateCreatedFormat = moment(post.dateCreated).format('lll');
            post.community = post.community.name
        }
        total = user.posts.length
        postJSON = {
            total,
            posts
        }
        res.send(postJSON)
    } else if (req.query.content === 'Comments') {
        let comments
        let commentJSON
        if (req.query.sortBy === 'New') {
            SortBy = { dateCreated: -1 }
        } else if (req.query.sortBy === 'Top') {
            SortBy = { rating: -1 }
        }
        comments = await Comment.find({ author: user._id })
            .lean()
            .sort(SortBy)
            .skip(req.query.skip)
            .limit(req.query.limit)
            .populate({
                path: 'post',
                model: Post,
                populate: {
                    path: 'community',
                    model: Community,
                }
            })
        for (let comment of comments) {
            omitUserComment(comment)
            comment.post.community = comment.post.community.name;
            comment.dateCreatedFormat = moment(comment.dateCreated).format('lll');
        }
        total = user.comments.length;
        commentJSON = {
            total,
            comments
        }
        res.send(commentJSON)
    }
}

module.exports.showIndexAPI = async(req, res) => {
    const user = await User.findOne({ username: req.params.username }).populate('memberships')
    const posts = await Post.find({ community: { $in: user.memberships } })
        .lean()
        .sort({ dateCreated: -1 })
        .skip(req.query.skip)
        .limit(req.query.limit)
        .populate({
            path: 'author',
            model: User,
            path: 'community',
            model: Community
        })
    for (let post of posts) {
        post.author = await User.findById(post.author)
        omitIndex(post)
        post.dateCreatedFormat = moment(post.dateCreated).format('lll');
    }
    const total = await Post.find({ community: { $in: user.memberships } }).countDocuments()
    let postJSON = {
        total,
        posts
    }
    res.send(postJSON)
}

module.exports.showIndexAPInonUser = async(req, res) => {
    const posts = await Post.find({})
        .lean()
        .sort({ dateCreated: -1 })
        .skip(req.query.skip)
        .limit(req.query.limit)
        .populate({
            path: 'author',
            model: User,
            path: 'community',
            model: Community
        })
    for (let post of posts) {
        post.author = await User.findById(post.author)
        omitIndex(post)
        post.dateCreatedFormat = moment(post.dateCreated).format('lll');
    }
    const total = await Post.find({}).countDocuments();
    let postJSON = {
        total,
        posts
    }
    res.send(postJSON)
}

function omitIndex(post) {
    delete post._id;
    delete post.__v;
    delete post.dateModified;
    post.author = post.author.username
    post.community = post.community.name
    post.comments = post.comments.length
}

function omitComm(post) {
    delete post._id;
    delete post.__v;
    post.author = post.author.username
}

function omitUserPost(post) {
    delete post._id;
    delete post.__v;
    delete post.author;
}

function omitUserComment(comment) {
    delete comment.__v;
    delete comment.post._id;
    delete comment.post.__v;
    delete comment.post.author;
    delete comment.post.comments;
}