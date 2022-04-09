const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const api = require('../controllers/api.controller')
const cors = require('../cors');

router.route('/')
    .get()

router.route('/c/')
    .get(api.showAPI)

router.route('/c/:name')
    .get(api.showCommunityAPI)

router.route('/test')
    .get(api.test)

module.exports = router;