const express = require('express');
const router = express.Router();
const Community = require('../models/community.schema');
const catchAsync = require('../utils/catchAsync');
const communities = require('../controllers/communities.controller');
const { isLoggedIn, validateCommunity } = require('../middleware');

router.route('/')
    .get(catchAsync(communities.index))
    .post(isLoggedIn, validateCommunity, catchAsync(communities.createCommunity))

router.get('/new', isLoggedIn, communities.renderNewForm)

router.route('/:id')
    .get(catchAsync(communities.showCommunity))
    .put(isLoggedIn, validateCommunity, catchAsync(communities.updateCommunity))

module.exports = router;