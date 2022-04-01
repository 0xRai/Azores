const User = require('../models/user.schema');
const Post = require('../models/post.schema');
const Community = require('../models/community.schema');
const Comment = require('../models/comment.schema');

module.exports.renderRegister = (req, res) => {
    res.render('user/register', { title: 'Register' });
}

module.exports.register = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Azores!');
            res.redirect('/');
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('./register');
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('user/login', { title: 'Login' });
}

module.exports.login = async(req, res) => {
    req.flash('success', 'Welcome back!');
    if (req.session.returnTo === '/user/logout') {
        var redirectUrl = '/';
    } else {
        var redirectUrl = req.session.returnTo || '/';
    }
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Sucessfully logged out!');
    res.redirect('/');
}

module.exports.showUser = async(req, res) => {
    const user = await User.findById(req.params.id).populate({
        path: 'posts',
        model: Post,
        populate: {
            path: 'community',
            model: Community,
        },
    }).populate({
        path: 'comments',
        model: Comment,
        populate: {
            path: 'post',
            model: Post,
            populate: {
                path: 'community',
                model: Community,
            },
        },
    })
    res.render('user/show', { user, title: `${user.username}'s Profile` })
}

module.exports.showUserTop = async(req, res) => {
    const user = await User.findById(req.params.id).populate({
        path: 'posts',
        model: Post,
        populate: {
            path: 'community',
            model: Community,
        },
    }).populate({
        path: 'comments',
        model: Comment,
        populate: {
            path: 'post',
            model: Post,
            populate: {
                path: 'community',
                model: Community,
            },
        },
    })
    res.render('user/showTop', { user, title: `${user.username}'s Profile` })
}