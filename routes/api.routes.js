const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const api = require('../controllers/api.controller');

router.route('/c/:name')
    .get(catchAsync(api.showCommunityAPI))

router.route('/u/:username')
    .get(catchAsync(api.showUserAPI))

router.route('/i/:username')
    .get(catchAsync(api.showIndexAPI))

module.exports = router;