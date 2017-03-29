/**
 * Created by nathan on 2017/2/28.
 */
var express = require('express');
var router = express.Router();
var request = require("superagent");

/* GET home page. */
router.get('/', function(req, res, next) {
    var hash = req.query.hash
    hash?
        request
            .get("http://www.kugou.com/yy/index.php?r=play/getdata&hash="+hash)
            .end(function (err, sres) {
                res.send(sres.text)
            }):
        res.send("error")
});

module.exports = router;
