/**
 * Created by nathan on 2017/3/15.
 */
//appSecret bc5b8b72f21da498d3df275ff62e1ddc
//获取accessToken的Api
//https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx2d5f55367eee33c4&secret=bc5b8b72f21da498d3df275ff62e1ddc
//返回
// {"access_token": "nkY3TMZxP2qdZzOpyP1tN4Q0h2ihANL_ZK379olFrYIiutoB37l9zo5g3qMv1BMk5YJA9AZL86AJi2wZacIGuxrG9KM_89c6JHhoHvRSRC22JFi1VQJNU6SUoV6dDODzFITbACAKNY","expires_in": 7200}



var express = require('express');
var router = express.Router();
var xml2js = require('xml2js')
var builder = new xml2js.Builder({rootName:'xml',cdata:true})

/* GET home page. */
router.get('/', function(req, res, next) {
    var data = req.param('echostr')
    res.send(data)
});
router.post('/', function(req, res, next) {

    var xml = req.body.xml
    console.log(xml)
    //     <xml>
    //     <ToUserName><![CDATA[toUser]]></ToUserName>
    //     <FromUserName><![CDATA[fromUser]]></FromUserName>
    //     <CreateTime>1348831860</CreateTime>
    //     <MsgType><![CDATA[text]]></MsgType>
    //     <Content><![CDATA[this is a test]]></Content>
    //     <MsgId>1234567890123456</MsgId>
    //     </xml>
    var obj = {}
    obj.ToUserName = xml.fromusername
    obj.FromUserName = xml.tousername
    obj.CreateTime = xml.createtime
    obj.MsgType = 'text'
    obj.Content = xml.content
    var data = builder.buildObject(obj)
    res.send(data)
});


module.exports = router;
