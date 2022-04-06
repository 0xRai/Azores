const ExpressError = require('./utils/ExpressError');
const { communitySchema, postSchema, commentSchema } = require('./schema');
const User = require('./models/user.schema')
const Community = require('./models/community.schema');
const Post = require('./models/post.schema');
const Comment = require('./models/comment.schema');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in.');
        return res.redirect('/user/login');
    }
    next();
}

module.exports.validateCommunity = (req, res, next) => {
    if (req.body.community.description === '') {
        req.body.community.description = 'Just a generic description!'
    }
    const { error } = communitySchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    next();
}

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    next();
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    next();
}

module.exports.isCreator = async(req, res, next) => {
    const communityName = req.params.name;
    const community = await Community.findOne({ name: communityName });
    if (!community.creator.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to perform that action.');
        return res.redirect(`/c/${id}`);
    }
    next();
}

module.exports.isPostAuthor = async(req, res, next) => {
    const { id, postId } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to perform that action.');
        return res.redirect(`/c/${id}/posts/${postId}`);
    }
    next();
}

module.exports.isCommentAuthor = async(req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to perform that action');
        return res.redirect(`/c/${id}/posts/${postId}`);
    }
    next();
}

module.exports.validateJoin = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    next();
}

module.exports.grabUserMemberships = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'memberships',
            model: Community,
        });
        const communities = user.memberships;
        res.locals.communities = communities;
    } catch {}
    next();
}