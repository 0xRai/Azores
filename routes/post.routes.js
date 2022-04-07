const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { postSchema } = require('../schema');
const { validatePost, isLoggedIn, isPostAuthor, grabUserMemberships } = require('../middleware');
const posts = require('../controllers/posts.controller');

router.route('/')
    .get(function(req, res) {
        res.redirect('/');
    })
    .post(isLoggedIn, validatePost, catchAsync(posts.createPost))

router.route('/new')
    .get(isLoggedIn, grabUserMemberships, posts.renderNewForm)
    .post(isLoggedIn, validatePost, catchAsync(posts.createPost))


router.route('/:URLid/:titleURL')
    .get(grabUserMemberships, catchAsync(posts.showPost))
    .put(isLoggedIn, validatePost, catchAsync(posts.updatePost))
    .delete(isLoggedIn, isPostAuthor, catchAsync(posts.deletePost))

router.get('/:URLid/:titleURL/edit', isLoggedIn, isPostAuthor, grabUserMemberships, catchAsync(posts.renderEditForm))

module.exports = router;