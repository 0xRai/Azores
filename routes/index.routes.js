const express = require('express');
const router = express.Router();
const User = require('../models/user.schema')
const Community = require('../models/community.schema')
const index = require('../controllers/index.controller');
const catchAsync = require('../utils/catchAsync');
const { grabUserMemberships } = require('../middleware')

/* GET home page. */

router.route('/')
    .get(grabUserMemberships, catchAsync(index.showContent))

router.get('/terms', grabUserMemberships, function(req, res, next) {
    res.render('terms', { title: 'Azores' });
});

module.exports = router;