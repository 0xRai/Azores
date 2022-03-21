const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateComment, isLoggedIn, isCommentAuthor } = require('../middleware');
const comments = require('../controllers/comments.controller');

router.route('/comments')
    .get(function(req, res) {
        res.redirect('/');
    })
    .post(isLoggedIn, validateComment, catchAsync(comments.createComment))

router.delete('/:commentId', isLoggedIn, catchAsync(comments.deleteComment))

module.exports = router;