const Community = require('../models/community.schema');
const Post = require('../models/post.schema');
const User = require('../models/user.schema');
const Comment = require('../models/comment.schema')

module.exports.index = async(req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts })
};

module.exports.renderNewForm = async(req, res) => {
    const community = await Community.findById(req.params.id);
    console.log(community)
    res.render('posts/new', { community, title: `New Post for ${community.name}` });
};

module.exports.createPost = async(req, res, next) => {
    const community = await Community.findById(req.params.id);
    const user = await User.findById(req.user._id);
    const post = new Post(req.body.post);
    post.author = req.user._id;
    post.community = req.params.id;
    user.posts.push(post);
    community.posts.push(post);
    community.lastPost = Date.now();
    await post.save();
    await user.save();
    await community.save();
    req.flash('success', 'Sucessfully made a new post!');
    res.redirect(`/c/${community._id}/posts/${post._id}`);
};

module.exports.showPost = async(req, res) => {

    const post = await Post.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author',
        }
    }).populate('author').populate('community');
    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect(`/c/${post.community}`)
    }
    res.render('posts/show', { post, title: `${post.title}: ${post.community.name}` });
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect('/posts')
    }
    res.render('posts/edit', { post, title: `Edit ${post.title}` });
}

module.exports.updatePost = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post });
    await post.save();
    req.flash('success', 'Sucessfully updated post!');
    res.redirect(`/c/${post.community}/posts/${post._id}`);
}

module.exports.deletePost = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    await Community.findByIdAndUpdate(post.community, { $pull: { posts: id } });
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted post!');
    res.redirect(`/c/${post.community}`);
}