const Community = require('../models/community.schema');
const Post = require('../models/post.schema');

module.exports.index = async(req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts })
};

module.exports.renderNewForm = async(req, res) => {
    const community = await Community.findById(req.params.id);
    res.render('posts/new'), { community };
};

module.exports.createPost = async(req, res, next) => {
    const community = await Community.findById(req.params.id);
    const post = new Post(req.body.post);
    post.author = req.user._id;
    community.posts.push(post);
    await post.save();
    await community.save();
    console.log(post);
    req.flash('success', 'Sucessfully made a new post!');
    res.redirect(`/c/${community._id}/posts/${post._id}`);
};

module.exports.showPost = async(req, res) => {
    const post = await Post.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect(`/c/${community._id}`)
    }
    res.render('posts/show', { post });
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect('/posts')
    }
    res.render('posts/edit', { post });
}

module.exports.updatePost = async(req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, {...req.body.post });
    await post.save();
    req.flash('success', 'Sucessfully updated post!');
    res.redirect(`/c/${community._id}/posts/${post._id}`);
}

module.exports.deletePost = async(req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success', 'Sucessfully deleted post!');
    res.redirect(`/c/${community._id}`);
}