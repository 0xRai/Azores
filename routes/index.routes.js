const express = require('express');
const router = express.Router();
const User = require('../models/user.schema')
const Community = require('../models/community.schema')
const index = require('../controllers/index.controller');
const catchAsync = require('../utils/catchAsync');

/* GET home page. */

router.route('/')
    // .get(function(req, res, next) {
    //     res.render('index', { title: 'Azores' });
    // })
    .get(index.showContent)

router.get('/terms', function(req, res, next) {
    res.render('terms', { title: 'Azores' });
});

module.exports = router;