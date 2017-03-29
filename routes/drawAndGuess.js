/**
 * Created by nathan on 2017/3/9.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', {  });
    res.sendfile("views/drawAndGuess.html")
});

module.exports = router;
