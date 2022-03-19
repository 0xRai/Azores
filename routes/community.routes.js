const express = require('express');
const app = require('../app');
const router = express.Router();
const Community = require('../models/community.schema');
const catchAsync = require('../utils/catchAsync');
const communities = require('../controllers/communities.controller');

router.route('/')
    .get(catchAsync(communities.index))


router.route('/:id')
    .get(catchAsync(communities.showCommunity));

module.exports = router;