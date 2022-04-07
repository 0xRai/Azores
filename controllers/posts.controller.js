const Community = require('../models/community.schema');
const Post = require('../models/post.schema');
const User = require('../models/user.schema');
const URLidGen = require('../utils/URLidGen')

module.exports.index = async(req, res) => {
    const posts = await Post.find({});
    res.render('posts/index', { posts })
};

module.exports.renderNewForm = async(req, res) => {
    const community = await Community.findById(req.params.id);
    res.render('posts/new', { community, title: `New Post for ${community.name}` });
};

module.exports.createPost = async(req, res, next) => {
    const community = await Community.findOne({ name: req.params.name });
    const user = await User.findById(req.user._id);
    const post = new Post(req.body.post);
    post.author = req.user._id;
    post.community = community.id;
    post.URLid = URLidGen();
    post.titleURL = post.title.replaceAll(/[ ?./]/gi, '_');
    user.posts.push(post);
    community.posts.push(post);
    community.lastPost = Date.now();
    await post.save();
    await user.save();
    await community.save();
    req.flash('success', 'Sucessfully made a new post!');
    res.redirect(`/c/${community.name}/posts/${post.URLid}/${post.titleURL}`);
};

module.exports.showPost = async(req, res) => {
    const { name, titleURL, URLid } = req.params;
    const communityName = name;
    const post = await Post.findOne({ titleURL: titleURL, URLid: URLid }).populate({
        path: 'comments',
        populate: {
            path: 'author',
        }
    }).populate('author').populate('community');
    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect(`/c/${communityName}`)
    }
    res.render('posts/show', { post, title: `${post.title}: ${post.community.name}` });
}

module.exports.renderEditForm = async(req, res) => {
    const { name, titleURL, URLid } = req.params;
    const communityName = name;
    const post = await Post.findOne({ titleURL: titleURL, URLid: URLid });
    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect('/posts')
    }
    res.render('posts/edit', { post, communityName, title: `Edit ${post.title}` });
}

module.exports.updatePost = async(req, res) => {
    const { name, titleURL, URLid } = req.params;
    const communityName = name;
    const post = await Post.findOne({ titleURL: titleURL, URLid: URLid });
    post.title = req.body.post.title;
    post.body = req.body.post.body;
    post.titleURL = post.title.replaceAll(/[ ?./]/gi, '_');
    await post.save();
    req.flash('success', 'Sucessfully updated post!');
    res.redirect(`/c/${communityName}/posts/${post.URLid}/${post.titleURL}`);
}

module.exports.deletePost = async(req, res) => {
    const { name, titleURL, URLid } = req.params;
    const communityName = name;
    const post = await Post.findOne({ titleURL: titleURL, URLid: URLid });
    const community = await Community.findOne({ name: communityName });
    await Community.findByIdAndUpdate(community, { $pull: { posts: post.id } });
    await User.findByIdAndUpdate(req.user.id, { $pull: { posts: post.id } });
    await Post.findByIdAndDelete(post.id);
    req.flash('success', 'Sucessfully deleted post!');
    res.redirect(`/c/${communityName}`);
}