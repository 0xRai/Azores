const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const auth = require('../controllers/auth.controller');

router.route('/')
    .get(function(req, res) {
        res.redirect('/');
    })

router.route('/register')
    .get(auth.renderRegister)
    .post(catchAsync(auth.register))

router.route('/login')
    .get(auth.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/auth/login' }), auth.login)

router.get('/logout', auth.logout)



module.exports = router;