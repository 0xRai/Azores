const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users.controller');
const { grabUserMemberships } = require('../middleware')

router.route('/')
    .get(function(req, res) {
        res.redirect('/');
    })

router.route('/:username')
    .get(grabUserMemberships, catchAsync(users.showUser))

router.route('/:username/top')
    .get(grabUserMemberships, catchAsync(users.showUserTop))

router.route('/:username/comments/')
    .get(grabUserMemberships, catchAsync(users.showUserComment))

router.route('/:username/comments/Top')
    .get(grabUserMemberships, catchAsync(users.showUserCommentTop))



module.exports = router;