const Post = require('../models/post.schema');
const Comment = require('../models/comment.schema');
const User = require('../models/user.schema')

module.exports.createComment = async(req, res) => {
    const { name, titleURL, URLid } = req.params;
    const communityName = name;
    const post = await Post.findOne({ titleURL: titleURL, URLid: URLid });
    const comment = new Comment(req.body.comment);
    const user = await User.findById(req.user._id);
    comment.author = req.user._id;
    comment.post = req.params.id;
    user.comments.push(comment);
    post.comments.push(comment);
    post.dateModified = Date.now();
    await user.save();
    await comment.save();
    await post.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/c/${communityName}/posts/${post.URLid}/${post.titleURL}`);
}

module.exports.deleteComment = async(req, res) => {
    const { name, titleURL, URLid, commentId } = req.params;
    const communityName = name;
    const post = await Post.findOne({ titleURL: titleURL, URLid: URLid });
    await Post.findByIdAndUpdate(post.id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(req.params.commentId);
    await User.findByIdAndUpdate(req.user.id, { $pull: { comments: commentId } });
    req.flash('success', 'Sucessfully deleted comment!');
    res.redirect(`/c/${communityName}/posts/${URLid}/${titleURL}`);
}