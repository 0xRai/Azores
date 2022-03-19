var express = require('express');
var router = express.Router();
const User = require('../models/user.schema');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const users = require('../controllers/users.controller');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)



module.exports = router;