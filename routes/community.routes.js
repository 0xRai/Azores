const express = require('express');
const router = express.Router();
const Community = require('../models/community.schema');
const catchAsync = require('../utils/catchAsync');
const communities = require('../controllers/communities.controller');
const { isLoggedIn, validateCommunity, isCreator, grabUserMemberships } = require('../middleware');

router.route('/')
    .get(grabUserMemberships, catchAsync(communities.index))
    .post(isLoggedIn, validateCommunity, catchAsync(communities.createCommunity))

router.get('/new', isLoggedIn, communities.renderNewForm)

router.route('/:name')
    .get(grabUserMemberships, catchAsync(communities.showCommunity))
    .put(isLoggedIn, validateCommunity, catchAsync(communities.updateCommunity))
    .delete(isLoggedIn, isCreator, catchAsync(communities.deleteCommunity))

router.route('/:name/top')
    .get(grabUserMemberships, catchAsync(communities.showCommunityTop))

router.route('/:name/hot')
    .get(grabUserMemberships, catchAsync(communities.showCommunityHot))

router.get('/:name/edit', isLoggedIn, isCreator, grabUserMemberships, catchAsync(communities.renderEditForm));

router.route('/:name/join')
    .post(isLoggedIn, catchAsync(communities.joinCommunity))
    .put(isLoggedIn, catchAsync(communities.leaveCommunity))
    .get(async function(req, res) {
        const community = await Community.findById(req.params.id);
        res.redirect(`/c/${community._id}`);
    })

module.exports = router;