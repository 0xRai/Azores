const express = require('express');
const router = express.Router();
const User = require('../models/user.schema');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const users = require('../controllers/users.controller');

router.route('/')
    .get(function(req, res) {
        res.redirect('/');
    })

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login' }), users.login)

router.get('/logout', users.logout)

router.route('/:id')
    .get(catchAsync(users.showUser))



module.exports = router;