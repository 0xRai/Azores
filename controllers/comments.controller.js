const Post = require('../models/post.schema');
const Comment = require('../models/comment.schema');
const Community = require('../models/community.schema')

module.exports.createComment = async(req, res) => {
    const community = await Community.findById(req.params.id).Post;
    const post = await Post.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    console.log(comment);
    console.log(post);
    await comment.save();
    post.comments.push(comment);
    await post.save();
    req.flash('success', 'Created new review!');
    res.redirect(`../../posts/${post._id}`);
}

module.exports.deleteComment = async(req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } })
    await Comment.findByIdAndDelete(req.params.commentId);
    req.flash('success', 'Sucessfully deleted comment!');
    res.redirect(`../../posts/${post._id}`);
}