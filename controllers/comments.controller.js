const Post = require('../models/post.schema');
const Comment = require('../models/comment.schema');
const User = require('../models/user.schema')

module.exports.createComment = async(req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    const user = await User.findById(req.user._id);
    comment.author = req.user._id;
    comment.post = req.params.id;
    user.comments.push(comment);
    post.comments.push(comment);
    await user.save();
    await comment.save();
    await post.save();
    req.flash('success', 'Created new review!');
    res.redirect(`../../posts/${post._id}`);
}

module.exports.deleteComment = async(req, res) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } })
    await Comment.findByIdAndDelete(req.params.commentId);
    req.flash('success', 'Sucessfully deleted comment!');
    res.redirect(`/c/${post.community._id}/posts/${post._id}`);
}