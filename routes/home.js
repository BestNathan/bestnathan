/**
 * Created by nathan on 2017/4/5.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.redirect('home')
});
/* GET home page. */
router.get('/home', function(req, res, next) {
    res.sendfile("views/homePage.html")
});

module.exports = router;