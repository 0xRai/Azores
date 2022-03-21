const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Community = require('../models/community.schema');
const Post = require('../models/post.schema');
const { postSchema } = require('../schema');
const { validatePost, isLoggedIn, isPostAuthor } = require('../middleware');
const posts = require('../controllers/posts.controller');

router.route('/')
    .get(function(req, res) {
        res.redirect('/');
    })
    .post(isLoggedIn, validatePost, catchAsync(posts.createPost))

router.get('/new', isLoggedIn, posts.renderNewForm)

router.route('/:id')
    .get(catchAsync(posts.showPost))
    .put(isLoggedIn, validatePost, catchAsync(posts.updatePost))
    .delete(isLoggedIn, isPostAuthor, catchAsync(posts.deletePost))

module.exports = router;