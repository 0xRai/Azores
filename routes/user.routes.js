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

router.route('/:id/top')
    .get(grabUserMemberships, catchAsync(users.showUserTop))



module.exports = router;