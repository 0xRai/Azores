var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Azores' });
});

router.get('/terms', function(req, res, next) {
    res.render('terms', { title: 'Azores' });
});

module.exports = router;